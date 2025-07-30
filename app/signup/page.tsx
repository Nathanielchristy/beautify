"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import Image from "next/image"
import Link from "next/link"
import type { JSX } from "react"

interface SignUpPageProps {
  onSignUp?: (email: string) => void
}

export const SignUpPage = ({ onSignUp }: SignUpPageProps): JSX.Element => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [signUpMessage, setSignUpMessage] = useState("")

  const handleSignUpClick = () => {
    if (!email || !password || !confirmPassword) {
      setSignUpMessage("Please fill in all fields.")
      return
    }

    if (password !== confirmPassword) {
      setSignUpMessage("Passwords do not match.")
      return
    }

    if (password.length < 6) {
      setSignUpMessage("Password must be at least 6 characters long.")
      return
    }

    // Simulate successful signup
    setSignUpMessage("Account created successfully!")
    onSignUp?.(email)
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden relative bg-cover bg-center bg-no-repeat" >
          {/* Video Element */}
          <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          >
              <source src="/background-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
          </video>
      <div className="absolute inset-0 bg-gradient-to-br from-[#060606]/80 via-[#060606]/60 to-[#060606]/90"></div>
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-16 xl:gap-24">

          {/* Left side - Woman image */}
          <div className="hidden lg:flex lg:w-1/2 lg:max-w-[705px] lg:h-[500px] xl:h-[600px] 2xl:h-[685px] flex-shrink-0 lg:order-1">
            {/* <Image
              src="/women-grey.png"
              alt="Woman with styled hair"
              width={705}
              height={685}
              className="object-cover w-full h-full rounded-lg shadow-2xl"
              priority
            /> */}
          </div>

          {/* Right side - Sign up form area */}
          <div className="flex flex-col items-center justify-center flex-shrink-0 lg:order-2 lg:w-1/2 lg:max-w-[700px] relative w-full">

            {/* Logo positioned above the form */}
            <div className="absolute -top-4 xs:-top-5 sm:-top-6 md:-top-8 lg:-top-16 xl:-top-20 left-1/2 transform -translate-x-1/2 z-10">
              <Image
                src="/gabi_logo.webp"
                alt="GABI Logo"
                width={255}
                height={255}
                className="object-cover w-28 h-28 xs:w-32 xs:h-32 sm:w-36 sm:h-36 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 2xl:w-64 2xl:h-64 pt-10"
              />
            </div>

            {/* Form container */}
            <div className="w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl min-h-[520px] xs:min-h-[560px] sm:min-h-[600px] md:min-h-[640px] lg:min-h-[680px] rounded-2xl sm:rounded-3xl lg:rounded-4xl border border-[#FFDE59] bg-white/[0.03] shadow-[0_5px_40px_0_rgba(255,222,89,0.60)] backdrop-blur-sm flex flex-col items-center justify-center p-6 xs:p-7 sm:p-8 md:p-10 lg:p-12 xl:p-16 pt-12 xs:pt-14 sm:pt-16 md:pt-18 lg:pt-20 xl:pt-24">

              {/* Email Input */}
              <div className="relative w-full max-w-[280px] xs:max-w-[300px] sm:max-w-[320px] md:max-w-[340px] lg:max-w-[360px] xl:max-w-[380px] h-11 xs:h-12 sm:h-13 md:h-14 lg:h-15 xl:h-16 mb-2 sm:mb-3 md:mb-4">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-full rounded-xl sm:rounded-2xl border border-[rgba(255,222,89,0.60)] bg-[rgba(255,222,89,0.60)] backdrop-blur-sm px-3 xs:px-4 sm:px-5 text-white font-reem-kufi-fun text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl placeholder:text-white/80 focus:border-[#FFDE59] focus:ring-1 focus:ring-[#FFDE59] focus:bg-[rgba(217,217,217,0.15)] outline-none transition-all duration-200"
                  placeholder="Email"
                />
              </div>

              {/* Password Input */}
              <div className="relative w-full max-w-[280px] xs:max-w-[300px] sm:max-w-[320px] md:max-w-[340px] lg:max-w-[360px] xl:max-w-[380px] h-11 xs:h-12 sm:h-13 md:h-14 lg:h-15 xl:h-16 mb-2 sm:mb-3 md:mb-4">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-full rounded-xl sm:rounded-2xl border border-[rgba(255,222,89,0.60)] bg-[rgba(255,222,89,0.60)] backdrop-blur-sm px-3 xs:px-4 sm:px-5 text-white font-reem-kufi-fun text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl placeholder:text-white/80 focus:border-[#FFDE59] focus:ring-1 focus:ring-[#FFDE59] focus:bg-[rgba(217,217,217,0.15)] outline-none transition-all duration-200"
                  placeholder="Password"
                />
              </div>

              {/* Confirm Password Input */}
              <div className="relative w-full max-w-[280px] xs:max-w-[300px] sm:max-w-[320px] md:max-w-[340px] lg:max-w-[360px] xl:max-w-[380px] h-11 xs:h-12 sm:h-13 md:h-14 lg:h-15 xl:h-16 mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-full rounded-xl sm:rounded-2xl border border-[rgba(255,222,89,0.60)] bg-[rgba(255,222,89,0.60)] backdrop-blur-sm px-3 xs:px-4 sm:px-5 text-white font-reem-kufi-fun text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl placeholder:text-white/80 focus:border-[#FFDE59] focus:ring-1 focus:ring-[#FFDE59] focus:bg-[rgba(217,217,217,0.15)] outline-none transition-all duration-200"
                  placeholder="Confirm Password"
                />
              </div>

              {/* Sign Up Button */}
              <div className="mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                <Button
                  onClick={handleSignUpClick}
                  className="w-36 xs:w-40 sm:w-44 md:w-48 lg:w-52 xl:w-56 h-9 xs:h-10 sm:h-11 md:h-12 lg:h-13 xl:h-14 rounded-2xl sm:rounded-3xl border border-[rgba(255,222,89,0.60)] bg-[rgba(255,222,89,0.97)] hover:bg-[#FFDE59] hover:scale-105 active:scale-95 text-[#272626] font-reem-kufi-fun text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Button>
              </div>

              {/* Error/Success Message */}
              {signUpMessage && (
                <div className="mb-2 sm:mb-3 md:mb-4 lg:mb-5 text-center w-full max-w-[280px] xs:max-w-[300px] sm:max-w-[320px] md:max-w-[340px] lg:max-w-[360px] xl:max-w-[380px]">
                  <p className={`font-reem-kufi-fun text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl px-2 py-2 rounded-lg backdrop-blur-sm ${
                    signUpMessage.includes("successfully") 
                      ? "text-green-400 bg-green-400/10 border border-green-400/20" 
                      : "text-red-400 bg-red-400/10 border border-red-400/20"
                  } transition-all duration-200`}>
                    {signUpMessage}
                  </p>
                </div>
              )}

              {/* Sign in link */}
              <div className="text-center px-2 max-w-[280px] xs:max-w-[300px] sm:max-w-[320px] md:max-w-[340px] lg:max-w-[360px] xl:max-w-[380px]">
                <div className="flex flex-col xs:flex-row items-center justify-center gap-1 xs:gap-2">
                  <span className="text-white font-reem-kufi-fun text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                    Already have an account?
                  </span>
                  <Link
                    href="/signin"
                    className="text-[rgba(255,222,89,0.97)] font-reem-kufi-fun text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl hover:text-[#FFDE59] transition-colors duration-200 underline-offset-2 hover:underline font-medium"
                  >
                    Sign In
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
              </div>

    </main>
  )
}

export default SignUpPage