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
    <Sidebar>
      <SidebarHeader>
        <a href="#" className="flex items-center gap-2 font-semibold">
          <span className="">Serenity Salon</span>
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
                >
                  <a href="#">
                    <Icon className="h-4 w-4" />
                    {item.label}
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
            <SidebarMenuButton asChild onClick={() => setShowLogoutConfirm(true)}>
              <a href="#">
                <LogOut className="h-4 w-4" />
                Logout
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
