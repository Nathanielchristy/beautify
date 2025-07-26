"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Separator } from "../../components/ui/separator"
import Image from "next/image"
import type { JSX } from "react"

interface SignInPageProps {
  onLogin: (email: string) => void
}

export const SignInPage = ({ onLogin }: SignInPageProps): JSX.Element => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginMessage, setLoginMessage] = useState("")

  // Data for the login form
  const loginData = {
    logo: "/group-1@2x.png",
    salonImage: "/rectangle-8.png", // Using local image for salon background
    googleIcon: "/google-1@2x.png",
    eyeIcon: "/mask-group@2x.png",
  }

  const handleLoginClick = () => {
    if (email === "dummy@example.com" && password === "password123") {
      setLoginMessage("Login successful!")
      onLogin(email) // Call the onLogin prop to update parent state
    } else {
      setLoginMessage("Invalid email or password.")
    }
  }

  return (
    <main className="bg-[#f9f6f6] w-screen h-screen flex overflow-hidden p-4 sm:p-6 lg:p-8">
      <div className="flex w-full h-full max-w-full">
        {/* Left: Salon Image */}
        <div className="w-1/3 h-full hidden lg:block relative">
          <Image
            className="object-cover rounded-[30px] "
            alt="Beauty salon interior"
            src={loginData.salonImage || "/placeholder.svg"}
            fill
            priority // Added priority for LCP image
          />
        </div>

        {/* Right: Login Card */}
        <div className="w-full lg:w-2/3 h-full min-w-0">
          <Card className="w-full h-full bg-[#fde5f3] rounded-[30px] border-[5px] border-solid border-[#dd0e7f] p-4 sm:p-6 lg:p-8">
            <CardContent className="p-0 h-full flex flex-col justify-center max-h-full overflow-hidden min-w-0">
              {/* Logo and brand */}
              <div className="flex flex-col items-center mb-4 lg:mb-6">
                <Image
                  className="w-16 sm:w-20 lg:w-24 h-auto"
                  alt="Glow Look logo"
                  src={loginData.logo || "/placeholder.svg"}
                  width={96}
                  height={96}
                />
                <h1 className="font-['Outfit',Helvetica] text-xl sm:text-2xl lg:text-3xl mt-2 lg:mt-3 text-[#92278f]">
                  Glow <span className="font-extrabold">Look</span>
                </h1>
                <h2 className="text-sm sm:text-lg lg:text-xl text-black">Beauty Salon</h2>
              </div>

              {/* Email field */}
              <div className="mb-3 lg:mb-4 flex justify-center">
                <Input
                  className="w-full sm:w-3/4 lg:w-1/2 h-10 lg:h-12 bg-white rounded-full px-4 lg:px-5 text-sm lg:text-base font-['Outfit',Helvetica]"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password field */}
              <div className="mb-3 lg:mb-4 flex justify-center">
                <div className="w-full sm:w-3/4 lg:w-1/2 relative">
                  <Input
                    type="password"
                    className="w-full h-10 lg:h-12 bg-white rounded-full px-4 lg:px-5 text-sm lg:text-base font-['Outfit',Helvetica]"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Image
                    className="absolute w-4 lg:w-5 h-4 lg:h-5 top-1/2 -translate-y-1/2 right-4 lg:right-5 cursor-pointer"
                    alt="Show password"
                    src={loginData.eyeIcon || "/placeholder.svg"}
                    width={20}
                    height={20}
                  />
                </div>
              </div>

              {/* Forget password */}
              <div className="mb-3 lg:mb-4 flex justify-center">
                <div className="w-full sm:w-3/4 lg:w-1/2 text-center text-xs text-black font-['Outfit',Helvetica]">
                  <a href="#" className="cursor-pointer">
                    Forget Password ?
                  </a>
                </div>
              </div>

              {/* Login Button */}
              <div className="mb-3 lg:mb-4 flex justify-center">
                <Button
                  className="w-full sm:w-3/4 lg:w-1/2 h-10 lg:h-12 rounded-full bg-[#92278f] hover:bg-[#92278f]/90"
                  onClick={handleLoginClick}
                >
                  <span className="font-['Outfit',Helvetica] font-extrabold text-white text-sm lg:text-lg">Log In</span>
                </Button>
              </div>

              {loginMessage && (
                <p
                  className={`text-center text-xs lg:text-sm mb-3 lg:mb-4 ${loginMessage.includes("successful") ? "text-green-600" : "text-red-600"}`}
                >
                  {loginMessage}
                </p>
              )}

              {/* OR Divider */}
              <div className="flex items-center justify-center mb-3 lg:mb-4">
                <Separator className="w-1/4" />
                <span className="mx-3 text-xs text-black font-['Outfit',Helvetica]">OR</span>
                <Separator className="w-1/4" />
              </div>

              {/* Google Login */}
              <div className="mb-3 lg:mb-4 flex justify-center">
                <Button
                  variant="outline"
                  className="w-full sm:w-3/4 lg:w-1/2 h-10 lg:h-12 bg-white rounded-full flex items-center justify-center"
                >
                  <Image
                    className="w-3 lg:w-4 h-3 lg:h-4 mr-2"
                    alt="Google"
                    src={loginData.googleIcon || "/placeholder.svg"}
                    width={16}
                    height={16}
                  />
                  <span className="text-xs text-black font-['Outfit',Helvetica]">Login With Google</span>
                </Button>
              </div>

              {/* Sign up link */}
              <div className="text-center text-xs font-['Outfit',Helvetica]">
                <span className="text-black">Don&apos;t have an account? </span>
                <a href="/signup" className="font-bold text-[#e70c84]">
                  Sign up
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default SignInPage