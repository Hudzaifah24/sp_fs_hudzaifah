"use client"

import React, { useEffect, useState } from "react"

type AlertType = "success" | "error"

interface AlertProps {
  type: AlertType
  message: string
  duration?: number
}

export default function AlertMessage({ type, message, duration = 4000 }: AlertProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration])

  if (!show) return null

  return (
    <div
      className={`fixed top-6 right-6 z-50 px-4 py-3 rounded shadow-lg text-white transition-all
        ${type === "success" ? "bg-green-500" : "bg-red-500"}`}
    >
      {message}
    </div>
  )
}
