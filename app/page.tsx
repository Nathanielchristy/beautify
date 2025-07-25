"use client"

import { useState } from "react"
import BeautyWellnessDashboard from "@/components/dashboard"
import { Login } from "@/components/login"

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState("")

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
        <Login onLogin={handleLogin} />
      )}
    </div>
  )
}
