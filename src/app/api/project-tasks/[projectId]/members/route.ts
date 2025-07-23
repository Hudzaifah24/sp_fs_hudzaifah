import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params }: { params: { projectId: string } }) {
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

  const form = await req.formData()
  const email = form.get("email") as string

  const userToAdd = await prisma.user.findUnique({
    where: { email },
  })

  if (!userToAdd) {
    return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 })
  }

  // Cek apakah sudah member
  const existing = await prisma.membership.findFirst({
    where: {
      projectId,
      userId: userToAdd.id,
    },
  })

  if (!existing) {
    await prisma.membership.create({
      data: {
        projectId,
        userId: userToAdd.id,
      },
    })
  }

  return NextResponse.redirect(new URL(`/projects/${projectId}`, req.url))
}
