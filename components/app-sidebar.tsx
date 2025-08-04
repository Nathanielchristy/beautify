"use client"

import { LogOut, Home, Users, UserCheck, Scissors, Calendar, Package, FileText, BarChart3 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"

interface AppSidebarProps {
  activeTab: string
  handleTabChange: (tabId: string) => void
  setShowLogoutConfirm: (show: boolean) => void
}

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "calendar", label: "Calendar", icon: Calendar },
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
    <div className="hidden lg:block">
      <Sidebar className="bg-white text-black">
        <SidebarHeader className="items-center bg-black/80">
          <a href="#" className="flex flex-col items-center gap-2 font-semibold px-4 py-4 mx-9 ml-10 mb-10 mt-2.5">
            <Image src="/gabi_logo.webp" alt="Glow Look Logo" width={100} height={100} className="h-30 w-30" />
          </a>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeTab === item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`flex items-center gap-3 hover:bg-gray-100 hover:text-black ${activeTab === item.id ? "bg-gray-200" : ""}`}
                  >
                    <a href="#" className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-gold" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-3 hover:bg-gray-100 hover:text-black"
              >
                <a href="#" className="flex items-center gap-3">
                  <LogOut className="h-4 w-4 text-gold" />
                  <span>Logout</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}