"use client"

import { useState } from "react"
import BeautyWellnessDashboard from "@/components/dashboard"

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [userEmail, setUserEmail] = useState("admin@beautify.com")

  const handleLogin = (email: string) => {
    setUserEmail(email)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserEmail("")
  }

  return (
    <div className="bg-rose-50 min-h-screen">
      {isLoggedIn ? (
        <BeautyWellnessDashboard onLogout={handleLogout} userEmail={userEmail} />
      ) : (
        <div />
      )}
    </div>
  )
}
