"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import Link from "next/link"
import type { JSX } from "react"

export const ForgotPasswordPage = (): JSX.Element => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = () => {
    if (email) {
      setMessage("Password reset link sent to your email!")
    } else {
      setMessage("Please enter a valid email address.")
    }
  }

  return (
    <main className="w-screen h-screen bg-[#060606] flex items-center justify-center">
      <div className="w-[500px] rounded-[40px] border border-[#FFDE59] bg-white/[0.03] shadow-[0_5px_40px_0_rgba(255,222,89,0.60)] p-12">
        <div className="flex flex-col items-center">
          <h1 className="text-white font-reem-kufi-fun text-3xl mb-8">Forgot Password?</h1>
          
          <p className="text-white/80 font-reem-kufi-fun text-lg mb-8 text-center">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>

          <div className="w-full mb-6">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[57px] rounded-[20px] border border-[rgba(255,222,89,0.60)] bg-[rgba(217,217,217,0.09)] px-4 text-white font-reem-kufi-fun text-xl placeholder:text-white/70 focus:border-[#FFDE59] focus:ring-1 focus:ring-[#FFDE59] outline-none"
              placeholder="Enter your email"
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full h-[48px] rounded-[30px] border border-[rgba(255,222,89,0.60)] bg-[rgba(255,222,89,0.97)] hover:bg-[#FFDE59] text-[#272626] font-reem-kufi-fun text-xl font-normal transition-colors mb-6"
          >
            Send Reset Link
          </Button>

          {message && (
            <p className={`text-center font-reem-kufi-fun text-lg mb-6 ${
              message.includes("sent") ? "text-green-400" : "text-red-400"
            }`}>
              {message}
            </p>
          )}

          <Link 
            href="/signin" 
            className="text-[rgba(255,222,89,0.97)] font-reem-kufi-fun text-lg hover:text-[#FFDE59] transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </main>
  )
}

export default ForgotPasswordPage
