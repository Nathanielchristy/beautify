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
    <div className="relative rounded-2xl p-6 text-foreground overflow-hidden shadow-xl bg-card">
      {/* Soft Gold Glow Accents */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>

      {/* Gold Gradient Stripe */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-3xl font-semibold mb-2 text-white">
          Welcome back to GABI
        </h1>
        <p className="text-sm text-white">
          Here's what's happening with your beauty business today.
        </p>
      </div>
    </div>


      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground text-white">Total Clients</p>
                <p className="text-2xl font-bold text-white">{clients.length}</p>
                <p className="text-xs text-muted-foreground text-white">Active clients</p>
              </div>
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-foreground" strokeWidth={2} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Today's Bookings</p>
                <p className="text-2xl font-bold text-white">{todayBookings}</p>
                <p className="text-xs text-white">Scheduled today</p>
              </div>
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-foreground" strokeWidth={2} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Revenue</p>
                <p className="text-2xl font-bold text-white">${totalRevenue.toFixed(0)}</p>
                <p className="text-xs text-white">This month</p>
              </div>
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary-foreground" strokeWidth={2} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Active Staff</p>
                <p className="text-2xl font-bold text-white">{activeStaffCount}</p>
                <p className="text-xs text-white">Available today</p>
              </div>
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-primary-foreground" strokeWidth={2} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales Chart - Moved before the other cards */}
<div className="grid grid-cols-1 gap-6">
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Sales</h3>
        <div className="text-sm text-muted-foreground text-white">Last 7 days</div>
      </div>
      <div className="h-64 ">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={salesData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="date" 
              className="stroke-muted-foreground"
              fontSize={12}
            />
            <YAxis 
              className="stroke-muted-foreground"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--card-foreground))'
              }}
              labelStyle={{ color: 'hsl(var(--primary))' }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              className="stroke-primary"
              strokeWidth={3}
              dot={{ className: 'fill-primary', r: 4 }}
              activeDot={{ r: 6, className: 'stroke-primary' }}
            />
            <Line
              type="monotone"
              dataKey="bookings"
              className="stroke-secondary-foreground"
              strokeWidth={2}
              dot={{ className: 'fill-secondary-foreground', r: 3 }}
              activeDot={{ r: 5, className: 'stroke-secondary-foreground' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-sm text-muted-foreground">Sales ($)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-secondary-foreground rounded-full"></div>
          <span className="text-sm text-muted-foreground">Bookings</span>
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