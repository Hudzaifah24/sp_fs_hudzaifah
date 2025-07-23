'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { prisma } from "@/lib/prisma"


export default function AuthForm({ type }: { type: "login" | "register" }) {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (type === 'register') {
            const res = await fetch("/api/register", {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: { "Content-Type": "application/json" },
            })

            console.log(prisma)

            if (res.ok) {
                router.push("/login")
            } else {
                const data = await res.json()
                setError(data.message || "Register gagal")
            }
        }

        if (type === 'login') {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password
            })

            if (res?.ok) {
                router.push("/dashboard")
            } else {
                setError("Login gagal")
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 space-y-4">
            <input 
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
            />
            <input 
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
            />
            <button 
                type="submit"
                className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                {type == 'register' ? 'Register' : 'Login'}
            </button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
    )
}