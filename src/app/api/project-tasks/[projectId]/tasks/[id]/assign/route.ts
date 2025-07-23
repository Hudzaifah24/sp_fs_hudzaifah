import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { projectId: string, id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const form = await request.formData()
  const assigneeId = form.get("assigneeId") as string

  const project = await prisma.project.findUnique({
    where: { id: params.projectId },
    include: { owner: true },
  })

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (project.ownerId !== user?.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  await prisma.task.update({
    where: { id: params.id },
    data: { assigneeId },
  })

  return NextResponse.redirect(new URL(request.headers.get("referer") || "/", request.url))
}
