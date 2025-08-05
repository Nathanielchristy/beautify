"use client"

import { Moon, Sun, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface TopBarProps {
  activeTab: string
  isDarkMode: boolean
  setIsDarkMode: (isDark: boolean) => void
  userEmail: string
}

export function TopBar({ activeTab, isDarkMode, setIsDarkMode, userEmail }: TopBarProps) {
  return (
    <header className="bg-gray backdrop-blur-xl border-b border-[#d4af37]/20 px-4 sm:px-6 py-4 shadow-md">
      <div className="flex items-center justify-between">
        {/* Title Section */}
        <div className="flex items-center space-x-4">
          {/* Desktop View Title */}
          <div className="hidden lg:block">
            <h2 className="text-lg font-semibold text-[#f5d76e] capitalize">
              {activeTab === "dashboard" ? "Dashboard Overview" : `${activeTab} Management`}
            </h2>
            <p className="text-sm text-gray-300">
              {activeTab === "dashboard" ? "Welcome back!" : `Manage your ${activeTab}`}
            </p>
          </div>

          {/* Mobile View Logo + Breadcrumb */}
          <div className="lg:hidden flex items-center gap-2">
            <Image src="/gabi_logo.webp" alt="GAbi Logo" width={70} height={70} />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="capitalize text-[#d4af37]">{activeTab}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center space-x-3">
          {/* Dark Mode Toggle */}
          {/* <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-[#d4af37]/50 bg-transparent hover:bg-[#d4af37]/10 text-[#d4af37]"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <Sun className="h-4 w-4" strokeWidth={2} /> : <Moon className="h-4 w-4" strokeWidth={2} />}
          </Button> */}

          {/* Notifications */}
          <Button
            variant="outline"
            size="sm"
            className="relative rounded-xl border-[#d4af37]/50 bg-transparent hover:bg-[#d4af37]/10 text-[#d4af37]"
          >
            <Bell className="h-4 w-4" strokeWidth={2} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </Button>

          {/* Avatar & User Info */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-gray-300 truncate max-w-[100px] sm:max-w-full">{userEmail}</p>
            </div>
            <Avatar className="w-10 h-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40&text=AU" />
              <AvatarFallback className="bg-gradient-to-br from-[#f5d76e] to-[#d4af37] text-black">
                AU
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}
