"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockBookings, mockInvoices, mockServices } from "@/data/mockData"
import { BarChart, LineChart, DollarSign, Calendar, Trash2, ClipboardList } from "lucide-react"

export function ReportsPageContent() {
  const [reportType, setReportType] = useState("bookings")

  const totalBookings = mockBookings.length
  const confirmedBookings = mockBookings.filter((b) => b.status === "Confirmed").length
  const pendingBookings = mockBookings.filter((b) => b.status === "Pending").length
  const cancelledBookings = mockBookings.filter((b) => b.status === "Cancelled").length

  const totalRevenue = mockInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
  const paidInvoices = mockInvoices.filter((inv) => inv.status === "Paid").length
  const pendingInvoices = mockInvoices.filter((inv) => inv.status === "Pending").length

  const servicePopularity: { [key: string]: number } = mockBookings.reduce(
    (acc, booking) => {
      acc[booking.serviceName] = (acc[booking.serviceName] || 0) + 1
      return acc
    },
    {} as { [key: string]: number },
  )

  const topServices = Object.entries(servicePopularity)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5)

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Reports</h1>
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Report Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bookings">Bookings Overview</SelectItem>
            <SelectItem value="revenue">Revenue Summary</SelectItem>
            <SelectItem value="services">Service Popularity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {reportType === "bookings" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">Total appointments scheduled</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{confirmedBookings}</div>
              <p className="text-xs text-muted-foreground">Appointments confirmed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingBookings}</div>
              <p className="text-xs text-muted-foreground">Appointments awaiting confirmation</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cancelledBookings}</div>
              <p className="text-xs text-muted-foreground">Appointments cancelled</p>
            </CardContent>
          </Card>
        </div>
      )}

      {reportType === "revenue" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total income from all invoices</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paidInvoices}</div>
              <p className="text-xs text-muted-foreground">Invoices successfully paid</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingInvoices}</div>
              <p className="text-xs text-muted-foreground">Invoices awaiting payment</p>
            </CardContent>
          </Card>
        </div>
      )}

      {reportType === "services" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Top 5 Most Popular Services</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {topServices.length > 0 ? (
                  topServices.map(([serviceName, count]) => (
                    <li key={serviceName} className="flex justify-between items-center">
                      <span className="font-medium">{serviceName}</span>
                      <span className="text-muted-foreground">{count} bookings</span>
                    </li>
                  ))
                ) : (
                  <p className="text-muted-foreground">No service data available.</p>
                )}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Services Offered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockServices.length}</div>
              <p className="text-xs text-muted-foreground">Unique services available</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
