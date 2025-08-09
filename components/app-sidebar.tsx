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
import NeonGabiLogo from "@/app/signin/NeonGabiLogo"

interface AppSidebarProps {
  activeTab: string
  handleTabChange: (tabId: string) => void
  setShowLogoutConfirm: (show: boolean) => void
}

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "clients", label: "Clients", icon: Users },
  { id: "staff", label: "Staff", icon: UserCheck },
  { id: "services", label: "Services", icon: Scissors },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "reports", label: "Reports", icon: BarChart3 },
]

export function AppSidebar({ activeTab, handleTabChange, setShowLogoutConfirm }: AppSidebarProps) {
  return (
    <div className="hidden lg:block">
      <Sidebar className="flex flex-col h-screen justify-between">
<div className="flex-grow flex flex-col">
  <SidebarHeader>
    {/* <a href="#" className="flex flex-col items-center gap-2 font-semibold px-4 py-4 mx-9 ml-10 mb-10 mt-2.5">
      <Image src="/gabi_logo.webp" alt="Glow Look Logo" width={300} height={300} className="h-40 w-40" />
    </a> */}
    <NeonGabiLogo size="medium" />
  </SidebarHeader>

  <SidebarContent className="flex-grow">
    <SidebarMenu>
      {sidebarItems.map((item) => {
        const Icon = item.icon
        return (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              asChild
              isActive={activeTab === item.id}
              onClick={() => handleTabChange(item.id)}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200
                ${activeTab === item.id
                  ? "bg-gray-200 text-black shadow-inner"
                  : "text-white hover:bg-gray-100 hover:text-black"}
              `}
            >
              <a href="#" className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  </SidebarContent>
</div>

        <SidebarFooter className="mb-10">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-3"
              >
                <a href="#" className="flex items-center gap-3 text-white">
                  <LogOut className="h-4 w-4" />
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