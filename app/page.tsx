"use client"

import { useState } from "react"
import BeautyWellnessDashboard from "@/components/dashboard"
import SignInPage from "@/app/signin/page"
import SignUpPage from "@/app/signup/page" 

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [showSignUp, setShowSignUp] = useState(false) 

  const handleLogin = (email: string) => {
    setUserEmail(email)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserEmail("")
  }
  const toggleAuthPage = () => setShowSignUp((prev) => !prev)
  return (
    <div className="bg-rose-50 min-h-screen">
      {isLoggedIn ? (
        <BeautyWellnessDashboard onLogout={handleLogout} userEmail={userEmail} />
      ) : showSignUp ? (
        <SignUpPage onSwitchToSignIn={toggleAuthPage} onSignUp={handleLogin} />
      ) : (
        <SignInPage onSwitchToSignUp={toggleAuthPage} onSignIn={handleLogin} />
      )}
    </div>
  )
}
