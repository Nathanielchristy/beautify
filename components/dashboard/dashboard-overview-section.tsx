"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar, DollarSign, UserCheck } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
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

  // Generate sales data for the last 7 days
  const generateSalesData = () => {
    const data = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateString = date.toISOString().split("T")[0]
      
      // Calculate daily sales from paid invoices
      const dailySales = invoices
        .filter(invoice => 
          invoice.status === "paid" && 
          invoice.date === dateString
        )
        .reduce((sum, invoice) => sum + invoice.total, 0)
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales: dailySales,
        bookings: bookings.filter(booking => booking.date === dateString).length
      })
    }
    
    return data
  }

  const salesData = generateSalesData()

  return (
    <div className="space-y-6">
    <div className="relative rounded-2xl p-6 text-white overflow-hidden shadow-xl bg-gradient-to-r from-[#0a0a0a] via-[#111] to-[#0a0a0a]">
      {/* Soft Gold Glow Accents */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#d4af37]/20 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#d4af37]/20 rounded-full blur-2xl"></div>

      {/* Gold Gradient Stripe */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#d4af37]/5 to-transparent pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-3xl font-semibold mb-2 text-[#ffc01f]">
          Welcome back to GABI
        </h1>
        <p className="text-sm text-[#ffc01f]">
          Here's what's happening with your beauty business today.
        </p>
      </div>
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

      {/* Recent Sales Chart - Moved before the other cards */}
<div className="grid grid-cols-1 gap-6">
  <Card className="bg-[#0d0d0d] border border-[#d4af37]/30 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#d4af37]">Recent Sales</h3>
        <div className="text-sm text-[#999999]">Last 7 days</div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={salesData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="date" 
              stroke="#d4af37"
              fontSize={12}
            />
            <YAxis 
              stroke="#d4af37"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #d4af37',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(212, 175, 55, 0.4)',
                color: '#fff'
              }}
              formatter={(value, name) => [
                name === 'sales' ? `$${value}` : value,
                name === 'sales' ? 'Sales' : 'Bookings'
              ]}
              labelStyle={{ color: '#d4af37' }}
              itemStyle={{ color: '#fff' }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#d4af37"
              strokeWidth={3}
              dot={{ fill: '#d4af37', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#d4af37', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#facc15" // gold-yellow for contrast
              strokeWidth={2}
              dot={{ fill: '#facc15', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#facc15', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#d4af37] rounded-full"></div>
          <span className="text-sm text-gray-300">Sales ($)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#facc15] rounded-full"></div>
          <span className="text-sm text-gray-300">Bookings</span>
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
    </div>
  )
}