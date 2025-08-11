"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import Image from "next/image"
import Link from "next/link"
import type { JSX } from "react"
import { Eye, EyeOff } from "lucide-react"
import NeonGabiLogo from "./NeonGabiLogo"
import { gsap } from "gsap"
import { useIsMobile } from "../../hooks/use-mobile"

interface SignInPageProps {
  onLogin: (email: string) => void
}

export const SignInPage = ({ onLogin }: SignInPageProps): JSX.Element => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginMessage, setLoginMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const isMobile = useIsMobile()

  const imagesRef = useRef<(HTMLDivElement | null)[]>([])
  const currentIndexRef = useRef(0)
  const animationTl = useRef<GSAPTimeline | null>(null)
  const timeoutId = useRef<NodeJS.Timeout | null>(null)

  const carouselImages = [
    "/carousel/barber1.jpg",
    "/carousel/model1.jpg",
    "/carousel/barber2.jpg",
  ]

  // Initialize images styles on mount
  useEffect(() => {
    imagesRef.current.forEach((img, index) => {
      if (img) {
        gsap.set(img, {
          opacity: index === 0 ? 1 : 0,
          scale: 1,
          rotation: 0,
          filter: "blur(0px)",
          zIndex: index === 0 ? 3 : 1,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          willChange: "opacity, transform",
        })
      }
    })

    // Initial scale fade-in for first image
    if (imagesRef.current[0]) {
      gsap.fromTo(
        imagesRef.current[0],
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.5 }
      )
    }
  }, [])

  // Animate to next image function
  const animateToNextImage = (nextIndex: number) => {
    if (animationTl.current) {
      animationTl.current.kill()
      animationTl.current = null
    }

    const currentImage = imagesRef.current[currentIndexRef.current]
    const nextImage = imagesRef.current[nextIndex]

    if (currentImage && nextImage) {
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut", duration: 1 },
        onComplete: () => {
          currentIndexRef.current = nextIndex
        },
      })

      tl.to(currentImage, {
        opacity: 0,
        scale: 1.15,
        rotation: 1,
        filter: "blur(2px)",
        duration: 1,
      })

      tl.fromTo(
        nextImage,
        {
          opacity: 0,
          scale: 0.85,
          rotation: -1,
          filter: "blur(1px)",
          zIndex: 2,
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
          zIndex: 3,
        },
        "-=0.6"
      )

      tl.set(currentImage, { zIndex: 1, rotation: 0, filter: "blur(0px)", scale: 1 })

      animationTl.current = tl
    }
  }

  // Recursive carousel loop using setTimeout
  useEffect(() => {
    const cycle = () => {
      const nextIndex = (currentIndexRef.current + 1) % carouselImages.length
      animateToNextImage(nextIndex)
      timeoutId.current = setTimeout(cycle, 5000)
    }

    timeoutId.current = setTimeout(cycle, 5000)

    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current)
      if (animationTl.current) animationTl.current.kill()
    }
  }, [])

  // Form handlers
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
    if (loginMessage) setLoginMessage("")
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (loginMessage) setLoginMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLoginClick()
    }
  }

  return (
    <main className="min-h-screen h-screen w-full overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#060606]/80 via-[#060606]/60 to-[#060606]/90"></div>
      <div className="relative z-10 w-full h-screen flex lg:p-0 p-4">
        <div className="w-full flex flex-col lg:flex-row h-full items-center justify-center lg:items-stretch lg:justify-stretch">
          {/* Left side - Image Carousel */}
          {/* Left side - Image Carousel */}
          <div className="hidden lg:block lg:w-1/2 h-full relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
              {carouselImages.map((imageSrc, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    imagesRef.current[index] = el
                  }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={imageSrc}
                    alt={`Carousel image ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="50vw"
                  />
                  {/* Glow overlays removed here */}
                  {/* <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 opacity-60" /> */}
                  {/* <div className="absolute inset-0 bg-gradient-to-r from-[#FFDE59]/5 via-transparent to-[#FFDE59]/5 animate-pulse" /> */}
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#FFDE59]/10 to-transparent pointer-events-none" />
          </div>


          {/* Right side - Login form area */}
          <div className="flex flex-col items-center justify-center w-full lg:w-1/2 px-4 relative">
            {/* Premium background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#FFDE59]/5 via-transparent to-[#FFDE59]/3"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,222,89,0.08)_0%,transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,222,89,0.06)_0%,transparent_40%)]"></div>

            {/* Animated mesh gradient overlay */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#FFDE59]/10 rounded-full blur-3xl animate-pulse"></div>
              <div
                className="absolute top-3/4 right-1/4 w-24 h-24 bg-[#FFB347]/8 rounded-full blur-2xl animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute top-1/2 left-1/2 w-20 h-20 bg-[#FFDE59]/5 rounded-full blur-xl animate-pulse"
                style={{ animationDelay: "2s" }}
              ></div>
            </div>

            {/* Subtle noise texture */}
            <div
              className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIHR5cGU9ImZyYWN0YWxOb2lzZSIvPjwvZmlsdGVyPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjQiLz48L3N2Zz4=')]"
            ></div>

            {/* Geometric pattern overlay */}
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `
                linear-gradient(30deg, transparent 40%, rgba(255,222,89,0.1) 41%, rgba(255,222,89,0.1) 42%, transparent 43%),
                linear-gradient(-30deg, transparent 40%, rgba(255,222,89,0.1) 41%, rgba(255,222,89,0.1) 42%, transparent 43%)
              `,
                backgroundSize: "20px 20px",
              }}
            ></div>

            <div className="relative z-10">
              {/* Form container */}
              <div className="w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl min-h-[500px] xs:min-h-[550px] sm:min-h-[600px] md:min-h-[650px] lg:min-h-[688px] rounded-2xl sm:rounded-3xl lg:rounded-4xl border-2 border-[#FFDE59]/70 bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-white/[0.02] shadow-[0_8px_60px_0_rgba(255,222,89,0.4),0_0_20px_0_rgba(255,222,89,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md flex flex-col items-center justify-center p-6 xs:p-7 sm:p-8 md:p-10 lg:p-12 xl:p-16 relative overflow-hidden">
                {/* Form inner glow effect */}
                <div className="absolute inset-1 rounded-2xl sm:rounded-3xl lg:rounded-4xl bg-gradient-to-br from-[#FFDE59]/5 via-transparent to-[#FFDE59]/3 pointer-events-none"></div>

                <div className="mb-8 relative z-10">
                  <NeonGabiLogo size={isMobile ? "medium" : "large"} />
                </div>

                {/* Email Input */}
                <div className="relative w-full max-w-[280px] xs:max-w-[300px] sm:max-w-[320px] md:max-w-[340px] lg:max-w-[360px] xl:max-w-[380px] h-11 xs:h-12 sm:h-13 md:h-14 lg:h-15 xl:h-16 mb-3 sm:mb-4 md:mb-5">
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#FFDE59]/20 via-[#FFDE59]/30 to-[#FFDE59]/20 blur-sm"></div>
                  <Input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onKeyPress={handleKeyPress}
                    autoComplete="email"
                    spellCheck={false}
                    autoCapitalize="none"
                    autoCorrect="off"
                    className="relative w-full h-full rounded-xl sm:rounded-2xl border-2 border-[rgba(255,222,89,0.70)] bg-[rgba(255,222,89,0.15)] backdrop-blur-md px-3 xs:px-4 sm:px-5 text-white font-reem-kufi-fun text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl placeholder:text-[#fffce1]/80 focus:border-[#FFDE59] focus:ring-2 focus:ring-[#FFDE59]/50 focus:bg-[rgba(255,222,89,0.25)] outline-none transition-all duration-300 caret-white selection:bg-[#FFDE59]/30 cursor-text shadow-[0_4px_20px_rgba(255,222,89,0.3)]"
                    placeholder="Email"
                    style={{ WebkitAppearance: "none", appearance: "none" }}
                  />
                </div>

                {/* Password Input */}
                <div className="relative w-full max-w-[280px] xs:max-w-[300px] sm:max-w-[320px] md:max-w-[340px] lg:max-w-[360px] xl:max-w-[380px] h-11 xs:h-12 sm:h-13 md:h-14 lg:h-15 xl:h-16 mb-4 sm:mb-5 md:mb-6 lg:mb-7">
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#FFDE59]/20 via-[#FFDE59]/30 to-[#FFDE59]/20 blur-sm"></div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyPress={handleKeyPress}
                    autoComplete="current-password"
                    spellCheck={false}
                    autoCapitalize="none"
                    autoCorrect="off"
                    className="relative w-full h-full rounded-xl sm:rounded-2xl border-2 border-[rgba(255,222,89,0.70)] bg-[rgba(255,222,89,0.15)] backdrop-blur-md px-3 xs:px-4 sm:px-5 pr-10 text-white font-reem-kufi-fun text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl placeholder:text-[#fffce1]/80 focus:border-[#FFDE59] focus:ring-2 focus:ring-[#FFDE59]/50 focus:bg-[rgba(255,222,89,0.25)] outline-none transition-all duration-300 caret-white selection:bg-[#FFDE59]/30 cursor-text shadow-[0_4px_20px_rgba(255,222,89,0.3)]"
                    placeholder="Password"
                    style={{ WebkitAppearance: "none", appearance: "none" }}
                  />

                  {/* Eye Icon Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FFDE59] hover:text-yellow-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFDE59]/50 rounded pointer-events-auto z-10 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(255,222,89,0.8)]"
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
                    className="relative text-white font-reem-kufi-fun text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl hover:text-[#FFDE59] transition-all duration-300 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-[#FFDE59]/50 rounded px-2 py-1 hover:drop-shadow-[0_0_8px_rgba(255,222,89,0.6)]"
                  >
                    Forget Password?
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFDE59]/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded"></div>
                  </Link>
                </div>

                {/* Login Button */}
                <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-7">
                  <Button
                    onClick={handleLoginClick}
                    disabled={!email || !password}
                    className="relative w-32 xs:w-36 sm:w-40 md:w-44 lg:w-48 xl:w-52 h-9 xs:h-10 sm:h-11 md:h-12 lg:h-13 xl:h-14 rounded-2xl sm:rounded-3xl border-2 border-[rgba(255,222,89,0.80)] bg-gradient-to-r from-[rgba(255,222,89,0.95)] via-[#FFDE59] to-[rgba(255,222,89,0.95)] hover:from-[#FFDE59] hover:to-[#FFDE59] font-reem-kufi-fun font-bold text-black text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl transition-all duration-300 shadow-[0_4px_16px_0_rgba(255,222,89,0.9)] disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Login
                  </Button>
                </div>

                {/* Login Message */}
                <div
                  aria-live="polite"
                  className={`text-center font-bold text-sm xs:text-base sm:text-lg md:text-xl ${
                    loginMessage.includes("successful")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {loginMessage}
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