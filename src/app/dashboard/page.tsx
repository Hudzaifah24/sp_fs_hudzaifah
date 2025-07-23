import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Navbar from "../../components/Navbar"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

async function getProjects(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      projects: true,
      memberships: { include: { project: true } },
    },
  })

  if (!user) return []

  const owned = user.projects
  const shared = user.memberships.map((m) => m.project)

  return [...owned, ...shared]
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) redirect("/login")

  const projects = await getProjects(session.user?.email)

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Selamat Datang 👋</h1>
          <p className="text-sm text-gray-600">Login sebagai: <span className="font-medium">{session.user.email}</span></p>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Daftar Projek</h2>
        </div>

        {projects.length === 0 ? (
          <p className="text-gray-500 italic">Belum ada project yang kamu miliki atau ikuti.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {projects.map((project) => (
              <a
                key={project.id}
                href={`/projects/${project.id}`}
                className="block border border-gray-200 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-medium text-blue-700">{project.name}</h3>
              </a>
            ))}
          </div>
        )}

        <form
          action="/api/project-tasks"
          method="POST"
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-2">Tambah Projek Baru</h3>
          <div className="flex gap-2">
            <input
              type="text"
              name="name"
              placeholder="Nama projek..."
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
            >
              Tambah
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
