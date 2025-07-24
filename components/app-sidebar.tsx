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
    <Sidebar collapsible="none" variant="inset" side="left">
      <SidebarHeader className="p-6 border-b border-roseLight-DEFAULT flex flex-col items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-roseDark-DEFAULT to-roseMedium-DEFAULT rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200">
          <span className="text-white font-bold text-lg">B</span>
        </div>
        <div className="group-data-[state=collapsed]/sidebar-wrapper:hidden mt-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-roseDark-DEFAULT to-roseMedium-DEFAULT bg-clip-text text-transparent">
            Beautify
          </h1>
        </div>
      </SidebarHeader>

      <SidebarContent className="mt-6 flex-1 px-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      className={`w-full justify-start rounded-xl transition-all duration-200 ${
                        activeTab === item.id
                          ? "bg-gradient-to-r from-deep-orchid to-terracotta-brown text-white shadow-lg"
                          : "bg-transparent text-gray-700 hover:bg-pale-blush/30"
                      }`}
                      asChild
                      isActive={activeTab === item.id}
                      size="lg"
                    >
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          handleTabChange(item.id)
                        }}
                      >
                        <Icon className="h-5 w-5" strokeWidth={2} />
                        <span className="font-medium text-base">{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-roseLight-DEFAULT">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="w-full text-left text-gray-700 hover:bg-pale-blush/30"
              onClick={() => {
                /* Add settings logic here */
              }}
              size="lg"
            >
              <Home className="h-5 w-5" strokeWidth={2} />
              <span className="group-data-[state=collapsed]/sidebar-wrapper:hidden">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="w-full text-left text-danger-DEFAULT hover:bg-danger-light/30 bg-pink-600 text-white"
              onClick={() => setShowLogoutConfirm(true)}
              size="lg"
            >
              <LogOut className="h-5 w-5" strokeWidth={2} />
              <span className="group-data-[state=collapsed]/sidebar-wrapper:hidden">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
