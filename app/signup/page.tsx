"use client"

import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"

export const SignUpPage = (): JSX.Element => {
  const formFields = [
    { id: "email", label: "Email", type: "email", hasEyeIcon: false },
    { id: "password", label: "Password", type: "password", hasEyeIcon: true },
    { id: "confirmPassword", label: "Confirm Password", type: "password", hasEyeIcon: true },
  ]

  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>({
    password: false,
    confirmPassword: false,
  })

  const toggleVisibility = (fieldId: string) => {
    setVisibleFields((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }))
  }

  return (
    <div
      className="flex flex-row justify-center w-full min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/background-makeup.jpg')",
      }}
    >
      <div className="w-full max-w-screen-xl py-6 sm:py-10 px-4 flex justify-center items-center">
        <Card className="relative w-full max-w-xl h-auto mx-auto bg-white/30 rounded-[2.5rem] border-[5px] border-solid border-[#fef8f8] p-5 sm:p-7 flex flex-col items-center">
          <CardContent className="p-0 w-full flex flex-col items-center ">
            {/* Logo and branding section */}
            <div className="flex flex-col items-center mb-5 sm:mb-7 mt-1">
              <img
                className="w-[100px] h-[110px] sm:w-[120px] sm:h-[130px] md:w-[140px] md:h-[150px]"
                alt="Glow Look Logo"
                src="/group-1@2x.png"
              />
              <div className="mt-[-8px] font-['Outfit',Helvetica] text-2xl sm:text-3xl md:text-4xl tracking-[0] leading-[normal]">
                <span className="text-[#92278f]">Glow</span>
                <span className="text-black">&nbsp;</span>
                <span className="font-extrabold text-[#92278f]">Look</span>
              </div>
              <div className="font-['Outfit',Helvetica] font-normal text-black text-base sm:text-lg md:text-xl tracking-[0] leading-[normal] mt-[2px]">
                Beauty Salon
              </div>
            </div>
            {/* Form Fields */}
            <div className="flex flex-col gap-[8px] sm:gap-[10px] w-full max-w-[450px] px-3">
              {formFields.map((field) => {
                const isVisible = visibleFields[field.id] ?? false
                return (
                  <div
                    key={field.id}
                    className="relative h-[50px] sm:h-[60px] bg-white rounded-[25px] flex items-center"
                  >
                    <Input
                      id={field.id}
                      type={field.hasEyeIcon ? (isVisible ? "text" : "password") : field.type}
                      placeholder={field.label}
                      className="h-full border-none shadow-none text-lg sm:text-xl font-['Outfit',Helvetica] text-gray-800 pl-5 sm:pl-6 pr-8 sm:pr-10 py-2 sm:py-3 placeholder:text-gray-400"
                    />
                    {field.hasEyeIcon && (
                      <button
                        type="button"
                        onClick={() => toggleVisibility(field.id)}
                        className="absolute right-5 sm:right-6 text-gray-400"
                        aria-label={isVisible ? "Hide password" : "Show password"}
                      >
                        {isVisible ? (
                          <EyeOffIcon className="w-[20px] h-[20px] sm:w-[22px] h-[22px]" />
                        ) : (
                          <EyeIcon className="w-[20px] h-[20px] sm:w-[22px] h-[22px]" />
                        )}
                      </button>
                    )}
                  </div>
                )
              })}
              {/* Sign Up Button */}
              <Button className="h-[50px] sm:h-[60px] mt-[6px] sm:mt-[8px] bg-pink-700 rounded-[25px] font-['Outfit',Helvetica] font-extrabold text-white text-lg sm:text-xl">
                Sign Up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SignUpPage
