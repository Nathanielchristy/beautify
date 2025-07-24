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
    <Sidebar collapsible="none" variant="inset" side="left" className="bg-gradient-to-b from-light-pink to-pale-purple">
      <SidebarHeader className="p-6 border-b border-pink-light flex flex-col items-center">
        <div className="w-12 h-12 bg-gradient-to-br from-electric-pink to-dark-purple rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200">
          <span className="text-white font-bold text-xl">B</span>
        </div>
        <div className="group-data-[state=collapsed]/sidebar-wrapper:hidden mt-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-electric-pink to-dark-purple bg-clip-text text-transparent">
            Beautify
          </h1>
        </div>
      </SidebarHeader>

      <SidebarContent className="mt-8 flex-1 px-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      className={`w-full justify-start rounded-full transition-all duration-300 ${
                        activeTab === item.id
                          ? "bg-gradient-to-r from-electric-pink to-dark-purple text-white shadow-lg scale-105"
                          : "bg-transparent text-gray-700 hover:bg-white/50 hover:text-electric-pink"
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
                        <Icon className="h-6 w-6" strokeWidth={2.5} />
                        <span className="font-semibold text-lg">{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-pink-light">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="w-full text-left text-gray-700 hover:bg-white/50 hover:text-electric-pink rounded-full"
              onClick={() => {
                /* Add settings logic here */
              }}
              size="lg"
            >
              <Home className="h-6 w-6" strokeWidth={2.5} />
              <span className="group-data-[state=collapsed]/sidebar-wrapper:hidden font-semibold">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="w-full text-left text-white bg-gradient-to-r from-electric-pink to-dark-purple hover:opacity-90 rounded-full"
              onClick={() => setShowLogoutConfirm(true)}
              size="lg"
            >
              <LogOut className="h-6 w-6" strokeWidth={2.5} />
              <span className="group-data-[state=collapsed]/sidebar-wrapper:hidden font-semibold">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
