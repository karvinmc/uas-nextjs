"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function Navbar() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleSignOut = () => {
    logout()
    router.push("/signin")
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          My App
        </Link>
        <div className="space-x-4">
          {user === null ? null : user?.id ? (
            <>
              <span className="text-gray-600">Hello, {user.username}</span>
              <button
                onClick={handleSignOut}
                className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/signin" className="text-blue-600 hover:text-blue-800 transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}