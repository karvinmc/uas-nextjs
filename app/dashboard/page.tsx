"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import UserDashboard from "@/components/UserDashboard"
import AdminDashboard from "@/components/AdminDashboard"

export default function Dashboard() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user === false) {
      router.push("/signin")
    }
  }, [user, router])

  if (user === null) return null // waiting for auth to load
  if (user === false) return null // unauthenticated

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome, {user.username}</h1>
      {user.role === "admin" ? <AdminDashboard /> : <UserDashboard />}
    </div>
  )
}
