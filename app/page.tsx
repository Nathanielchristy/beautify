"use client"

import { useState } from "react"
import BeautyWellnessDashboard from "@/components/dashboard"
import SignInPage from "@/app/signin/page"

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
    <div className="bg-black/50 min-h-screen"style={{backgroundImage: 'url("/5459923.jpg")'}}>
      {isLoggedIn ? (
        <BeautyWellnessDashboard onLogout={handleLogout} userEmail={userEmail} />
      ) : (
        <SignInPage onLogin={handleLogin} /> // Pass handleLogin as a prop
      )}
    </div>
  )
}
