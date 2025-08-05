"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import type { Booking } from "@/types"

interface RecentBookingsCardProps {
  bookings: Booking[]
  setSelectedItem: (item: any) => void
  setIsViewDetailsOpen: (isOpen: boolean) => void
}

export function RecentBookingsCard({ bookings, setSelectedItem, setIsViewDetailsOpen }: RecentBookingsCardProps) {
  return (
    <Card className="lg:col-span-2 bg-black/95 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Clock className="w-5 h-5 text-white" strokeWidth={2} />
          <span>Recent Bookings</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.slice(0, 4).map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-4 bg-roseBackground-DEFAULT rounded-xl hover:bg-roseLight-DEFAULT/30 transition-colors shadow-sm"
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
                  <p className="font-medium text-white">{booking.clientName}</p>
                  <p className="text-sm text-gray-600">{booking.serviceName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{booking.time}</p>
                <Badge
                  className={
                    booking.status === "completed"
                      ? "bg-success-light text-success-DEFAULT"
                      : booking.status === "confirmed"
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
      </CardContent>
    </Card>
  )
}
