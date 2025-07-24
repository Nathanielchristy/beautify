"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"
import Sparkles from "@/components/ui/sparkles" // Import Sparkles component

interface LoginProps {
  onLogin: (credentials: { email: string; password: string }) => void
  error?: string
}

export default function LoginPage({ onLogin, error }: LoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onLogin({ email, password })
    setIsLoading(false)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate password reset
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    setShowForgotPassword(false)

    toast({
      title: "Password Reset Sent",
      description: "Password reset link has been sent to your email!",
    })
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-roseBackground-DEFAULT via-roseLight-DEFAULT to-roseMedium-DEFAULT flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-roseLight-DEFAULT rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-roseMedium-DEFAULT rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-roseDark-DEFAULT rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-2xl rounded-2xl">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center bg-gradient-to-br from-roseDark-DEFAULT to-roseMedium-DEFAULT rounded-2xl shadow-lg">
                <span className="text-2xl font-bold text-white drop-shadow-lg">B</span>
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-roseDark-DEFAULT to-roseMedium-DEFAULT bg-clip-text text-transparent">
                Reset Password
              </CardTitle>
              <CardDescription className="text-gray-600">
                Enter your email address and we'll send you a link to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="admin@beautify.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-roseDark-DEFAULT to-roseMedium-DEFAULT hover:from-roseDeep-DEFAULT hover:to-roseDark-DEFAULT text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-gray-600 hover:text-roseDark-DEFAULT hover:bg-roseLight-DEFAULT/30 rounded-xl"
                  onClick={() => setShowForgotPassword(false)}
                >
                  Back to Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-roseBackground-DEFAULT via-roseLight-DEFAULT to-roseMedium-DEFAULT flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-roseLight-DEFAULT rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-roseMedium-DEFAULT rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-roseDark-DEFAULT rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-2xl rounded-2xl">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto w-20 h-20 mb-6 flex items-center justify-center bg-gradient-to-br from-roseDark-DEFAULT to-roseMedium-DEFAULT rounded-2xl shadow-lg text-slate-900 bg-[rgba(200,149,184,1)]">
              <span className="text-3xl font-bold text-white drop-shadow-lg">B</span>
            </div>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-roseDark-DEFAULT to-roseMedium-DEFAULT bg-clip-text text-black">
                Beautify Admin
              </CardTitle>
              <Sparkles className="w-5 h-5 text-roseDark-DEFAULT" />
            </div>
            <CardDescription className="text-gray-600">Sign in to your wellness dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-6 border-danger-light bg-danger-light/80 backdrop-blur-sm rounded-xl">
                <AlertDescription className="text-danger-DEFAULT">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@beautify.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-12 border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm rounded-xl"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent rounded-xl"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="border-roseMedium-DEFAULT data-[state=checked]:bg-roseDark-DEFAULT data-[state=checked]:text-white"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-roseDark-DEFAULT hover:text-roseDeep-DEFAULT p-0"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot password?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-dusty-rose to-muted-mauve hover:from-deep-orchid hover:to-terracotta-brown text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 bg-roseBackground-DEFAULT/50 backdrop-blur-sm rounded-lg px-3 py-2">
                Demo: admin@beautify.com / admin123
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">© 2024 Beautify Admin Dashboard. All rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  )
}
