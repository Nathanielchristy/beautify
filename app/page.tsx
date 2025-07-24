"use client"

import { useState } from "react"
import LoginPage from "../components/login"
import BeautyWellnessDashboard from "../components/dashboard"

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [loginError, setLoginError] = useState("")

  const handleLogin = (credentials: { email: string; password: string }) => {
    // Demo authentication - in real app, this would be an API call
    if (credentials.email === "admin@beautify.com" && credentials.password === "admin123") {
      setIsAuthenticated(true)
      setUserEmail(credentials.email)
      setLoginError("")
    } else {
      setLoginError("Invalid email or password. Please try again.")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserEmail("")
    setLoginError("")
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} error={loginError} />
  }

  return <BeautyWellnessDashboard onLogout={handleLogout} userEmail={userEmail} />
}
