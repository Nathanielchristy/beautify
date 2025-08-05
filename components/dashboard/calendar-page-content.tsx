"use client"
import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus, ChevronLeft, ChevronRight, Edit, Trash2, Search } from "lucide-react"
import { toast } from "react-hot-toast" // Import toast from react-hot-toast
import type { Booking } from "@/types"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { mockClients, mockServices, mockStaff } from "@/data/mockData"
import { toYMD } from "@/lib/utils"
import { DayView } from "./day-view"
import { WeekView } from "./week-view"

interface CalendarPageContentProps {
  bookings: Booking[]
  setIsAddBookingOpen: (isOpen: boolean) => void
  setSelectedItem: (item: any) => void
  setIsViewDetailsOpen: (isOpen: boolean) => void
  handleUpdateBookingStatus: (id: string, status: Booking["status"]) => void
  setBookings: (bookings: Booking[]) => void
}

export function CalendarPageContent({
  bookings,
  setIsAddBookingOpen,
  setSelectedItem,
  setIsViewDetailsOpen,
  handleUpdateBookingStatus,
  setBookings,
}: CalendarPageContentProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all")
  const [calendarView, setCalendarView] = useState("month")

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const isToday = (date: Date, day: number) => {
    const today = new Date()
    return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && day === today.getDate()
  }

  const isSameDay = (date1: Date, date2: Date) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      if (bookingStatusFilter !== "all" && booking.status !== bookingStatusFilter) {
        return false
      }
      return true
    })
  }, [bookings, bookingStatusFilter])

  const getBookingsForDate = (date: Date, day: number) => {
    const targetDate = new Date(date.getFullYear(), date.getMonth(), day)
    const dateString = toYMD(targetDate)
    return filteredBookings.filter((booking) => booking.date === dateString)
  }

  const navigate = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      const multiplier = direction === "prev" ? -1 : 1
      switch (calendarView) {
        case "month":
          newDate.setMonth(newDate.getMonth() + multiplier)
          break
        case "week":
          newDate.setDate(newDate.getDate() + 7 * multiplier)
          break
        case "day":
          newDate.setDate(newDate.getDate() + 1 * multiplier)
          break
      }
      return newDate
    })
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(clickedDate)
    setIsAddBookingOpen(true)
  }

  return (
    <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-lg font-bold">
                <Calendar className="w-5 h-5" />
                <span>Calendar View</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
                <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("prev")}
                >
                <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-semibold text-base min-w-48 text-center">
                {formatMonthYear(currentDate)}
                </span>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("next")}
                >
                <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex items-center space-x-2">
                <Button onClick={() => setCalendarView("month")} variant={calendarView === "month" ? "default" : "outline"}>Month</Button>
                <Button onClick={() => setCalendarView("week")} variant={calendarView === "week" ? "default" : "outline"}>Week</Button>
                <Button onClick={() => setCalendarView("day")} variant={calendarView === "day" ? "default" : "outline"}>Day</Button>
            </div>
            </div>
        </CardHeader>

        <CardContent className="p-0">
            {calendarView === "month" && (
            <>
                {/* Weekdays Header */}
                <div className="grid grid-cols-7 bg-muted text-muted-foreground font-semibold">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="p-3 text-center border">
                    {day}
                    </div>
                ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7">
            {(() => {
                const daysInMonth = getDaysInMonth(currentDate)
                const firstDay = getFirstDayOfMonth(currentDate)
                const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7

                return Array.from({ length: totalCells }, (_, i) => {
                const dayNumber = i - firstDay + 1
                const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth
                const isCurrentDay = isValidDay && isToday(currentDate, dayNumber)
                const isSelected =
                    selectedDate &&
                    isValidDay &&
                    isSameDay(selectedDate, new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber))
                const dayBookings = isValidDay ? getBookingsForDate(currentDate, dayNumber) : []
                const isWeekend = i % 7 === 0 || i % 7 === 6

                if (!isValidDay) {
                    return <div key={i} className="min-h-32 bg-muted-foreground/10 border" />
                }

                return (
                    <div
                    key={i}
                    className={`min-h-32 p-2 border transition-all duration-200 group cursor-pointer ${
                        isWeekend ? "bg-accent/50" : "bg-background"
                    } ${
                        isCurrentDay
                        ? "ring-2 ring-primary bg-primary/20"
                        : isSelected
                        ? "ring-2 ring-primary/70 bg-accent"
                        : ""
                    } hover:bg-accent`}
                    onClick={() => handleDateClick(dayNumber)}
                    >
                    <div className={`flex items-center justify-between mb-2 ${isCurrentDay ? "text-primary-foreground" : "text-foreground"}`}>
                        <span
                        className={`text-sm font-bold ${
                            isCurrentDay || isSelected
                            ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs"
                            : ""
                        }`}
                        >
                        {dayNumber}
                        </span>
                        {dayBookings.length > 0 && (
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs font-medium text-muted-foreground">{dayBookings.length}</span>
                        </div>
                        )}
                    </div>

                    {/* Bookings */}
                    <div className="space-y-1">
                        {dayBookings.slice(0, 3).map((booking) => {
                        const statusColors = {
                            completed: "bg-green-500 text-white",
                            confirmed: "bg-blue-600 text-white",
                            pending: "bg-yellow-500 text-black",
                            cancelled: "bg-red-500 text-white",
                        }

                        return (
                            <div
                            key={booking.id}
                            className={`text-xs p-2 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 ${
                                statusColors[booking.status] || statusColors.pending
                            }`}
                            onClick={(e) => {
                                e.stopPropagation()
                                setSelectedItem(booking)
                                setIsViewDetailsOpen(true)
                            }}
                            >
                            <div className="truncate">{booking.clientName}</div>
                            <div className="truncate opacity-80">{booking.serviceName}</div>
                            <div className="opacity-60">{booking.time.split(" - ")[0]}</div>
                            </div>
                        )
                        })}

                        {dayBookings.length > 3 && (
                        <div
                            className="text-xs text-center p-1 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
                            onClick={(e) => {
                            e.stopPropagation()
                            toast({
                                title: "All Bookings",
                                description: `${dayBookings.length} bookings on ${dayNumber}/${currentDate.getMonth() + 1}`,
                            })
                            }}
                        >
                            +{dayBookings.length - 3} more
                        </div>
                        )}

                        {dayBookings.length === 0 && (
                        <div
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-center p-2 border-2 border-dashed border-primary/40 text-primary/60 hover:border-primary hover:text-primary"
                            onClick={(e) => {
                            e.stopPropagation()
                            handleDateClick(dayNumber)
                            }}
                        >
                            <Plus className="h-3 w-3 mx-auto mb-1" />
                            Add booking
                        </div>
                        )}
                    </div>
                    </div>
                )
                })
            })()}
            </div>

            {/* Legend */}
            <div className="p-4 bg-background border-t">
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                {[
                ["Completed", "bg-green-500"],
                ["Confirmed", "bg-blue-600"],
                ["Pending", "bg-yellow-500"],
                ["Cancelled", "bg-red-500"],
                ].map(([label, color]) => (
                <div key={label} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 ${color} rounded-full`} />
                    <span>{label}</span>
                </div>
                ))}
            </div>
            </div>
            </>
            )}
            {calendarView === "week" && <WeekView bookings={bookings} currentDate={currentDate} />}
            {calendarView === "day" && <DayView bookings={bookings} selectedDate={selectedDate || currentDate} />}
        </CardContent>
    </Card>
  )
}
