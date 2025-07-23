import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const form = await request.formData()
  const name = form.get("name") as string

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  const project = await prisma.project.create({
    data: {
      name,
      ownerId: user.id,
    },
  })

  return NextResponse.redirect(new URL(request.headers.get("referer") || "/", request.url))
}