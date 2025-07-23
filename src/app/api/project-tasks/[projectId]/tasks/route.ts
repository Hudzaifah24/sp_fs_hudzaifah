import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request, { params }: { params: { projectId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const projectId = params.projectId

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 })

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: true
    }
  })

  if (project?.ownerId !== user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const form = await request.formData()
  const title = form.get("title") as string
  const description = form.get("description") as string | null

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: "todo",
      assigneeId: user.id,
      projectId: projectId,
    },
  })

  return NextResponse.redirect(new URL(request.headers.get("referer") || "/", request.url))
}
