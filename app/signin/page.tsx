"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"

export default function SignIn() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { user, login } = useAuth()

  useEffect(() => {
    if (user && user.id) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username || !password) {
      setError("Username and password are required")
      return
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single()

    if (error || !data) {
      setError("Invalid username or password")
      return
    }

    login(data)
    router.push("/dashboard")
  }

  if (user === null) return null

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign In</h1>
      {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-6 text-center">{error}</p>}
      <form onSubmit={handleSignIn} className="space-y-6">
        <div className="relative">
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field peer"
            placeholder=" "
          />
          <label
            htmlFor="username"
            className="absolute left-3 -top-2.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 bg-white px-1 cursor-text"
          >
            Username
          </label>
        </div>
        <div className="relative">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field peer"
            placeholder=" "
          />
          <label
            htmlFor="password"
            className="absolute left-3 -top-2.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 bg-white px-1 cursor-text"
          >
            Password
          </label>
        </div>
        <button type="submit" className="btn-primary w-full cursor-pointer">
          Sign In
        </button>
      </form>
    </div>
  )
}
