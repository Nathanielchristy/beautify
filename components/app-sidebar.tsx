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
      <Sidebar>
        <SidebarHeader className="items-center">
          <a href="#" className="flex flex-col items-center gap-2 font-semibold px-4 py-4 mx-9 ml-10 mb-10 mt-2.5">
            <Image src="/group-1@2x.png" alt="Glow Look Logo" width={80} height={80} className="h-20 w-20" />
            <div className="flex flex-col items-center mt-2">
              <h1 className="font-['Outfit',Helvetica] text-2xl text-[#92278f]">
                Glow <span className="font-extrabold">Look</span>
              </h1>
              <h2 className="text-lg text-black">Beauty Salon</h2>
            </div>
          </a>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <SidebarMenuItem key={item.id} className="bg-pink-100">
                  <SidebarMenuButton
                    asChild
                    isActive={activeTab === item.id}
                    onClick={() => handleTabChange(item.id)}
                    className="flex items-center gap-3"
                    style={activeTab === item.id ? { backgroundColor: '#92278f', color: 'white' } : {}}
                  >
                    <a href="#" className="flex items-center gap-3" style={activeTab === item.id ? { backgroundColor: '#92278f', color: 'white' } : {}}>
                      <Icon className="h-4 w-4" />
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
            <SidebarMenuItem className="bg-pink-100">
              <SidebarMenuButton
                asChild
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-3"
              >
                <a href="#" className="flex items-center gap-3">
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