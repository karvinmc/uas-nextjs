import "./globals.css"
import type { Metadata } from "next"
import Navbar from "@/components/Navbar"
import { AuthProvider } from "@/contexts/AuthContext"

export const metadata: Metadata = {
  title: "Next.js App",
  description: "A clean app with sign-in and role-based dashboards"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-8 max-w-5xl">{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
