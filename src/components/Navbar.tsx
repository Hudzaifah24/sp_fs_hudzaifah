"use client"

import { signOut } from "next-auth/react"
import Link from "next/link"

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition">
          Management App
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-gray-700 hover:text-blue-600 transition">
            Dashboard
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded transition"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  )
}
