"use client"
import type { Booking } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toYMD } from "@/lib/utils"

interface WeekViewProps {
  bookings: Booking[]
  currentDate: Date
}

export function WeekView({ bookings, currentDate }: WeekViewProps) {
  const startOfWeek = new Date(currentDate)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek)
    day.setDate(day.getDate() + i)
    return day
  })

  const bookingsForWeek = days.map((day) => ({
    date: day,
    bookings: bookings.filter(
      (booking) => booking.date === toYMD(day),
    ),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Week of {startOfWeek.toLocaleDateString("en-US", { month: 'long', day: 'numeric' })}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {bookingsForWeek.map(({ date, bookings }) => (
            <div key={date.toISOString()} className="border p-2">
              <h3 className="font-bold">{date.toLocaleDateString("en-US", { weekday: 'short', day: 'numeric' })}</h3>
              {bookings.length > 0 ? (
                <ul>
                  {bookings.map((booking) => (
                    <li key={booking.id}>
                      {booking.time}: {booking.clientName}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No bookings</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
