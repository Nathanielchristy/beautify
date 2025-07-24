"use client"

import { LogOut, Home, Users, UserCheck, Scissors, Calendar, Package, FileText, BarChart3 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

interface AppSidebarProps {
  activeTab: string
  handleTabChange: (tabId: string) => void
  setShowLogoutConfirm: (show: boolean) => void
}

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "clients", label: "Clients", icon: Users },
  { id: "staff", label: "Staff", icon: UserCheck },
  { id: "services", label: "Services", icon: Scissors },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "reports", label: "Reports", icon: BarChart3 },
]

export function AppSidebar({ activeTab, handleTabChange, setShowLogoutConfirm }: AppSidebarProps) {
  return (
    <div className="hidden border-r bg-white lg:block dark:bg-gray-950">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <a href="#" className="flex items-center gap-2 font-semibold">
            <span className="">Serenity Salon</span>
          </a>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.id}
                  href="#"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-primary dark:text-gray-400 dark:hover:text-primary ${
                    activeTab === item.id ? "bg-gray-100 text-primary dark:bg-gray-800 dark:text-primary" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleTabChange(item.id)
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </a>
              )
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-primary dark:text-gray-400 dark:hover:text-primary"
            onClick={(e) => {
              e.preventDefault()
              setShowLogoutConfirm(true)
            }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </a>
        </div>
      </div>
    </div>
  )
}
