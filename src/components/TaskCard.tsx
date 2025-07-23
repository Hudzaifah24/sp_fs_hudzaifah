"use client"

import React from "react"

export default function TaskCard({
  taskId,
  projectId,
  title,
  description,
  status,
  assigneeId,
  members,
  assigneeEmail,
}: {
  taskId: string
  projectId: string
  title: string
  description?: string
  status: string
  assigneeId: string
  members: { id: string; email: string }[]
  assigneeEmail: string
}) {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 mb-4 transition hover:shadow-md">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          <div className="mt-2 text-xs text-gray-500 space-y-1">
            <p><span className="font-medium text-gray-700">Penanggung Jawab:</span> {assigneeEmail}</p>
            <p><span className="font-medium text-gray-700">Status:</span> <span className="text-blue-600">{status}</span></p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {/* Ganti Status */}
          <form method="POST" action={`/api/project-tasks/${projectId}/tasks/${taskId}/status`}>
            <select
              name="status"
              defaultValue={status}
              onChange={(e) => e.currentTarget.form?.submit()}
              className="text-sm border border-gray-300 rounded px-2 py-1 bg-white shadow-sm"
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </form>

          {/* Hapus */}
          <form method="POST" action={`/api/project-tasks/${projectId}/tasks/${taskId}/delete`}>
            <button className="text-sm text-red-600 hover:underline">Hapus</button>
          </form>
        </div>
      </div>

      {/* Edit Task */}
      <details className="mt-3">
        <summary className="text-sm text-blue-600 cursor-pointer hover:underline">Edit Tugas</summary>
        <form
          method="POST"
          action={`/api/project-tasks/${projectId}/tasks/${taskId}/edit`}
          className="mt-2 space-y-2"
        >
          <input
            type="text"
            name="title"
            defaultValue={title}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            required
          />
          <textarea
            name="description"
            defaultValue={description}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            rows={3}
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded transition"
          >
            Simpan Perubahan
          </button>
        </form>
      </details>

      {/* Assign User */}
      <details className="mt-3">
        <summary className="text-sm text-blue-600 cursor-pointer hover:underline">Ganti Penanggung Jawab</summary>
        <form
          method="POST"
          action={`/api/project-tasks/${projectId}/tasks/${taskId}/assign`}
          className="mt-2 space-y-2"
        >
          <select
            name="assigneeId"
            defaultValue={assigneeId}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"
          >
            {members.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition"
          >
            Simpan PJ
          </button>
        </form>
      </details>
    </div>
  )
}
