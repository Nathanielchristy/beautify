"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar, DollarSign, UserCheck } from "lucide-react"
import type { Client, Staff, Booking, Invoice } from "@/types"
import { RecentBookingsCard } from "./recent-bookings-card"
import { QuickActionsCard } from "./quick-actions-card"
import { UpcomingAppointmentsCard } from "./upcoming-appointments-card"

interface DashboardOverviewSectionProps {
  clients: Client[]
  bookings: Booking[]
  invoices: Invoice[]
  staff: Staff[]
  setIsAddBookingOpen: (isOpen: boolean) => void
  setIsAddClientOpen: (isOpen: boolean) => void
  setIsAddServiceOpen: (isOpen: boolean) => void
  setIsCreateInvoiceOpen: (isOpen: boolean) => void
  setSelectedItem: (item: any) => void
  setIsViewDetailsOpen: (isOpen: boolean) => void
}

export function DashboardOverviewSection({
  clients,
  bookings,
  invoices,
  staff,
  setIsAddBookingOpen,
  setIsAddClientOpen,
  setIsAddServiceOpen,
  setIsCreateInvoiceOpen,
  setSelectedItem,
  setIsViewDetailsOpen,
}: DashboardOverviewSectionProps) {
  const totalRevenue = invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.total, 0)
  const todayBookings = bookings.filter((b) => b.date === new Date().toISOString().split("T")[0]).length
  const activeStaffCount = staff.filter((s) => s.isActive).length

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-roseDark-DEFAULT via-roseMedium-DEFAULT to-roseLight-DEFAULT rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-[rgba(231,12,132,1)]"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">Welcome back to Beautify! ✨</h1>
          <p className="text-roseBackground-DEFAULT">Here's what's happening with your beauty business today.</p>
        </div>
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-roseBackground-DEFAULT to-roseLight-DEFAULT border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-roseDark-DEFAULT mb-1">Total Clients</p>
                <p className="text-2xl font-bold text-roseDeep-DEFAULT">{clients.length}</p>
                <p className="text-xs text-roseDark-DEFAULT mt-1">Active clients</p>
              </div>
              <div className="w-12 h-12 bg-roseDark-DEFAULT rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-roseBackground-DEFAULT to-roseMedium-DEFAULT border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-roseDark-DEFAULT mb-1">Today's Bookings</p>
                <p className="text-2xl font-bold text-roseDeep-DEFAULT">{todayBookings}</p>
                <p className="text-xs text-roseDark-DEFAULT mt-1">Scheduled today</p>
              </div>
              <div className="w-12 h-12 bg-roseMedium-DEFAULT rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-roseBackground-DEFAULT to-success-light border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-success-DEFAULT mb-1">Revenue</p>
                <p className="text-2xl font-bold text-success-DEFAULT">${totalRevenue.toFixed(0)}</p>
                <p className="text-xs text-success-DEFAULT mt-1">This month</p>
              </div>
              <div className="w-12 h-12 bg-success-DEFAULT rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-roseBackground-DEFAULT to-info-light border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-info-DEFAULT mb-1">Active Staff</p>
                <p className="text-2xl font-bold text-info-DEFAULT">{activeStaffCount}</p>
                <p className="text-xs text-info-DEFAULT mt-1">Available today</p>
              </div>
              <div className="w-12 h-12 bg-info-DEFAULT rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentBookingsCard
          bookings={bookings}
          setSelectedItem={setSelectedItem}
          setIsViewDetailsOpen={setIsViewDetailsOpen}
        />
        <QuickActionsCard
          setIsAddBookingOpen={setIsAddBookingOpen}
          setIsAddClientOpen={setIsAddClientOpen}
          setIsAddServiceOpen={setIsAddServiceOpen}
          setIsCreateInvoiceOpen={setIsCreateInvoiceOpen}
        />
        <UpcomingAppointmentsCard
          bookings={bookings}
          setSelectedItem={setSelectedItem}
          setIsViewDetailsOpen={setIsViewDetailsOpen}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Sales</h3>
            <div className="h-64">
              {/* Add graph component here */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
