import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { projectId: string, id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  const projectId = params.projectId

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: true
    }
  })

  if (project?.ownerId !== user?.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const form = await request.formData()
  const status = form.get("status") as string

  const updated = await prisma.task.update({
    where: { id: params.id },
    data: { status },
  })

  return NextResponse.redirect(new URL(request.headers.get("referer") || "/", request.url))
}
