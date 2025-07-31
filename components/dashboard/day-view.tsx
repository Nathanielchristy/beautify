"use client"
import type { Booking } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toYMD } from "@/lib/utils"

interface DayViewProps {
  bookings: Booking[]
  selectedDate: Date
}

export function DayView({ bookings, selectedDate }: DayViewProps) {
  const bookingsForDay = bookings.filter(
    (booking) => booking.date === toYMD(selectedDate)
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{selectedDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardTitle>
      </CardHeader>
      <CardContent>
        {bookingsForDay.length > 0 ? (
          <ul>
            {bookingsForDay.map((booking) => (
              <li key={booking.id}>
                {booking.time}: {booking.clientName} - {booking.serviceName}
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookings for this day.</p>
        )}
      </CardContent>
    </Card>
  )
}
