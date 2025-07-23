import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import TaskCard from "@/components/TaskCard"
import Navbar from "@/components/Navbar"

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login")

  const projectId = params.id

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: true,
      memberships: { include: { user: true } },
      tasks: { include: { assignee: true } },
    },
  })

  if (!project) {
    return <div className="p-4">Project tidak ditemukan</div>
  }

  const isOwner = project.owner.email === session.user.email

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-blue-700">{project.name}</h1>
          <p className="text-sm text-gray-600">Pemilik: {project.owner.email}</p>
        </header>

        {/* Anggota */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Anggota Project</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
            {project.memberships.map((m) => (
              <li key={m.user.id}>{m.user.email}</li>
            ))}
          </ul>

          <form
            action={`/api/project-tasks/${projectId}/members`}
            method="POST"
            className="space-y-2 bg-white p-4 border rounded"
          >
            <h3 className="text-sm font-semibold">Tambah Anggota</h3>
            <input
              type="email"
              name="email"
              placeholder="Email user"
              required
              className="w-full border border-gray-300 p-2 rounded text-sm"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
            >
              Tambah
            </button>
          </form>
        </section>

        {/* Tugas */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Daftar Tugas</h2>
          {project.tasks.length === 0 && (
            <p className="text-sm text-gray-500">Belum ada tugas</p>
          )}
          {project.tasks.map((task) => (
            <TaskCard
              key={task.id}
              taskId={task.id}
              projectId={projectId}
              title={task.title}
              description={task.description || ""}
              status={task.status}
              assigneeId={task.assigneeId}
              members={project.memberships.map((m) => m.user)}
              assigneeEmail={task.assignee.email}
            />
          ))}
        </section>

        {/* Tambah Tugas */}
        <section className="mb-8 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Tambah Tugas Baru</h3>
          <form
            method="POST"
            action={`/api/project-tasks/${projectId}/tasks`}
            className="space-y-2 bg-white p-4 border rounded"
          >
            <input
              type="text"
              name="title"
              placeholder="Judul tugas"
              required
              className="w-full border border-gray-300 p-2 rounded text-sm"
            />
            <textarea
              name="description"
              placeholder="Deskripsi (opsional)"
              className="w-full border border-gray-300 p-2 rounded text-sm"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
            >
              Tambah Tugas
            </button>
          </form>
        </section>

        {/* Hapus Project */}
        {isOwner && (
          <form
            method="POST"
            action={`/api/project-tasks/${projectId}/delete`}
            className="mt-6"
          >
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
              type="submit"
            >
              Hapus Project
            </button>
          </form>
        )}
      </main>
    </div>
  )
}
