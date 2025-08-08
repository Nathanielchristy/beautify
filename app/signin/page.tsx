"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import Image from "next/image"
import Link from "next/link"
import type { JSX } from "react"
import { Eye, EyeOff } from "lucide-react"

interface SignInPageProps {
  onLogin: (email: string) => void
}

export const SignInPage = ({ onLogin }: SignInPageProps): JSX.Element => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginMessage, setLoginMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleLoginClick = () => {
    if (email === "dummy@example.com" && password === "password123") {
      setLoginMessage("Login successful!")
      onLogin(email)
    } else {
      setLoginMessage("Invalid email or password.")
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    // Clear any previous error messages when user starts typing
    if (loginMessage) {
      setLoginMessage("")
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    // Clear any previous error messages when user starts typing
    if (loginMessage) {
      setLoginMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLoginClick()
    }
  }

  return (
    <main className="min-h-screen h-screen w-full overflow-hidden relative ">
      {/* Video Element */}
      {/* <video
        autoPlay
        loop
        muted
        playsInline
        poster="/5459923.jpg"
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="/background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#060606]/80 via-[#060606]/60 to-[#060606]/90"></div>
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-4 md:p-6 lg:p-8">
        <div className="w-full flex flex-col lg:flex-row min-h-screen items-center justify-center lg:items-stretch lg:justify-stretch">


          {/* Left side - Woman image */}
          <div className="hidden lg:flex w-full lg:w-1/2 h-full">
            <Image
              src="/lady.png"
              alt="Woman with styled hair"
              fill
              className="object-cover w-full h-full"
              priority
            />
          </div>

          {/* Right side - Login form area */}
          <div className="flex flex-col items-center justify-center w-full px-4 relative">



            {/* Form container */}
            <div className="w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl min-h-[500px] xs:min-h-[550px] sm:min-h-[600px] md:min-h-[650px] lg:min-h-[688px] rounded-2xl sm:rounded-3xl lg:rounded-4xl border border-[#FFDE59] bg-white/[0.03] shadow-[0_5px_40px_0_rgba(255,222,89,0.60)] backdrop-blur-sm flex flex-col items-center justify-center p-6 xs:p-7 sm:p-8 md:p-10 lg:p-12 xl:p-16 pt-16 xs:pt-18 sm:pt-20 md:pt-22 lg:pt-24 xl:pt-28">
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
              {/* Email Input */}
              <div className="relative w-full max-w-[280px] xs:max-w-[300px] sm:max-w-[320px] md:max-w-[340px] lg:max-w-[360px] xl:max-w-[380px] h-11 xs:h-12 sm:h-13 md:h-14 lg:h-15 xl:h-16 mb-3 sm:mb-4 md:mb-5">
                <Input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onKeyPress={handleKeyPress}
                  autoComplete="email"
                  spellCheck={false}
                  autoCapitalize="none"
                  autoCorrect="off"
                  className="w-full h-full rounded-xl sm:rounded-2xl border border-[rgba(255,222,89,0.60)] bg-[rgba(255,222,89,0.60)] backdrop-blur-sm px-3 xs:px-4 sm:px-5 text-white font-reem-kufi-fun text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl placeholder:text-[#fffce1]/80 focus:border-[#FFDE59] focus:ring-1 focus:ring-[#FFDE59] focus:bg-[rgba(217,217,217,0.15)] outline-none transition-all duration-200 caret-white selection:bg-[#FFDE59]/30 cursor-text"
                  placeholder="Email"
                  style={{ WebkitAppearance: 'none', appearance: 'none' }}
                />
              </div>

              {/* Password Input */}
              <div className="relative w-full max-w-[280px] xs:max-w-[300px] sm:max-w-[320px] md:max-w-[340px] lg:max-w-[360px] xl:max-w-[380px] h-11 xs:h-12 sm:h-13 md:h-14 lg:h-15 xl:h-16 mb-4 sm:mb-5 md:mb-6 lg:mb-7">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyPress={handleKeyPress}
                  autoComplete="current-password"
                  spellCheck={false}
                  autoCapitalize="none"
                  autoCorrect="off"
                  className="w-full h-full rounded-xl sm:rounded-2xl border border-[rgba(255,222,89,0.60)] bg-[rgba(255,222,89,0.60)] backdrop-blur-sm px-3 xs:px-4 sm:px-5 pr-10 text-white font-reem-kufi-fun text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl placeholder:text-[#fffce1]/80 focus:border-[#FFDE59] focus:ring-1 focus:ring-[#FFDE59] focus:bg-[rgba(217,217,217,0.15)] outline-none transition-all duration-200 caret-white selection:bg-[#FFDE59]/30 cursor-text"
                  placeholder="Password"
                  style={{ WebkitAppearance: 'none', appearance: 'none' }}
                />

                {/* Eye Icon Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FFD700] hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFDE59]/50 rounded pointer-events-auto z-10"
                  aria-label="Toggle password visibility"
                  tabIndex={0}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Forget Password Link */}
              <div className="w-full max-w-[280px] xs:max-w-[300px] sm:max-w-[320px] md:max-w-[340px] lg:max-w-[360px] xl:max-w-[380px] text-center mb-5 sm:mb-6 md:mb-7 lg:mb-8">
                <Link 
                  href="/forgot-password" 
                  className="text-white font-reem-kufi-fun text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl hover:text-[#FFDE59] transition-colors duration-200 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-[#FFDE59]/50 rounded px-1"
                >
                  Forget Password?
                </Link>
              </div>

              {/* Login Button */}
              <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-7">
                <Button
                  onClick={handleLoginClick}
                  disabled={!email || !password}
                  className="w-32 xs:w-36 sm:w-40 md:w-44 lg:w-48 xl:w-52 h-9 xs:h-10 sm:h-11 md:h-12 lg:h-13 xl:h-14 rounded-2xl sm:rounded-3xl border border-[rgba(255,222,89,0.60)] bg-[rgba(255,222,89,0.97)] hover:bg-[#FFDE59] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-[rgba(255,222,89,0.97)] text-[#272626] font-reem-kufi-fun text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#FFDE59]/50"
                >
                  Login
                </Button>
              </div>

              {/* Error/Success Message */}
              {loginMessage && (
                <div className="mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-center w-full max-w-[280px] xs:max-w-[300px] sm:max-w-[320px] md:max-w-[340px] lg:max-w-[360px] xl:max-w-[380px]">
                  <p className={`font-reem-kufi-fun text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl px-2 py-2 rounded-lg backdrop-blur-sm ${
                    loginMessage.includes("successful") 
                      ? "text-green-400 bg-green-400/10 border border-green-400/20" 
                      : "text-red-400 bg-red-400/10 border border-red-400/20"
                  } transition-all duration-200`}>
                    {loginMessage}
                  </p>
                </div>
              )}

              {/* Sign up link */}
              <div className="text-center px-2 max-w-[280px] xs:max-w-[300px] sm:max-w-[320px] md:max-w-[340px] lg:max-w-[360px] xl:max-w-[380px]">
                <div className="flex flex-col xs:flex-row items-center justify-center gap-1 xs:gap-2">
                  <span className="text-white font-reem-kufi-fun text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                    Don&apos;t have an account?
                  </span>
                  <Link
                    href="/signup"
                    className="text-[rgba(255,222,89,0.97)] font-reem-kufi-fun text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl hover:text-[#FFDE59] transition-colors duration-200 underline-offset-2 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-[#FFDE59]/50 rounded px-1"
                  >
                    Sign up
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

export default SignInPage