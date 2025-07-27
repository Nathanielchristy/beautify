"use client"

import { Moon, Sun, Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface TopBarProps {
  activeTab: string
  isDarkMode: boolean
  setIsDarkMode: (isDark: boolean) => void
  userEmail: string
}

export function TopBar({ activeTab, isDarkMode, setIsDarkMode, userEmail }: TopBarProps) {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-roseLight-DEFAULT px-4 sm:px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="-ml-1">
            <Menu className="h-6 w-6" />
          </SidebarTrigger>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 capitalize">
              {activeTab === "dashboard" ? "Dashboard Overview" : `${activeTab} Management`}
            </h2>
            <p className="text-sm text-gray-600">
              {activeTab === "dashboard" ? "Welcome back!" : `Manage your ${activeTab}`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-roseLight-DEFAULT bg-transparent hover:bg-roseLight-DEFAULT/30"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <Sun className="h-4 w-4" strokeWidth={2} /> : <Moon className="h-4 w-4" strokeWidth={2} />}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-roseLight-DEFAULT relative bg-transparent hover:bg-roseLight-DEFAULT/30"
          >
            <Bell className="h-4 w-4" strokeWidth={2} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-danger-DEFAULT rounded-full"></div>
          </Button>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">Admin User</p>
              <p className="text-xs text-gray-600 truncate max-w-[100px] sm:max-w-full">{userEmail}</p>
            </div>
            <Avatar className="w-10 h-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40&text=AU" />
              <AvatarFallback className="bg-gradient-to-br from-roseDark-DEFAULT to-roseMedium-DEFAULT text-white">
                AU
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}
