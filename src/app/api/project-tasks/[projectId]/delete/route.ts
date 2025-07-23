import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { projectId: string } }) {
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

  await prisma.task.deleteMany({
    where: { projectId },
  })

  await prisma.membership.deleteMany({
    where: { projectId },
  })
  
  await prisma.project.delete({
    where: { id: projectId },
  })

  return NextResponse.redirect(new URL("/dashboard", request.url))
}
