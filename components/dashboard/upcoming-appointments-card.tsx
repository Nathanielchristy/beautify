"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarCheck } from "lucide-react"
import type { Booking } from "@/types"

interface UpcomingAppointmentsCardProps {
  bookings: Booking[]
  setSelectedItem: (item: any) => void
  setIsViewDetailsOpen: (isOpen: boolean) => void
}

export function UpcomingAppointmentsCard({
  bookings,
  setSelectedItem,
  setIsViewDetailsOpen,
}: UpcomingAppointmentsCardProps) {
  const upcomingBookings = bookings
    .filter((b) => new Date(b.date) >= new Date() && (b.status === "confirmed" || b.status === "pending"))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4) // Show up to 4 upcoming bookings

  return (
    <Card className="lg:col-span-1 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-roseDark-DEFAULT">
          <CalendarCheck className="w-5 h-5 text-roseDark-DEFAULT" strokeWidth={2} />
          <span>Upcoming Appointments</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingBookings.length > 0 ? (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-roseBackground-DEFAULT rounded-xl hover:bg-roseLight-DEFAULT/30 transition-colors cursor-pointer shadow-sm"
                onClick={() => {
                  setSelectedItem(booking)
                  setIsViewDetailsOpen(true)
                }}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${booking.clientName.charAt(0)}`} />
                    <AvatarFallback className="bg-roseLight-DEFAULT text-roseDeep-DEFAULT">
                      {booking.clientName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-800">{booking.clientName}</p>
                    <p className="text-sm text-gray-600">{booking.serviceName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{booking.date}</p>
                  <p className="text-xs text-gray-600">{booking.time}</p>
                  <Badge
                    className={
                      booking.status === "confirmed"
                        ? "bg-info-light text-info-DEFAULT"
                        : "bg-warning-light text-warning-DEFAULT"
                    }
                  >
                    {booking.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">No upcoming appointments.</p>
        )}
      </CardContent>
    </Card>
  )
}
