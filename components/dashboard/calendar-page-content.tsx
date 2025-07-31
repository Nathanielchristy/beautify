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
    const dateString = targetDate.toISOString().split("T")[0]
    return filteredBookings.filter((booking) => booking.date === dateString)
  }

  const navigateMonth = (direction: "prev" | "next") =>
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(clickedDate)
    setIsAddBookingOpen(true)
  }

  return (
    <Card className="bg-black/80 backdrop-blur border border-gold/30 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gold to-yellow-600 text-[#FFD700] shadow-md">
            <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-lg font-bold">
                <Calendar className="w-5 h-5 text-[#FFD700]" />
                <span>Calendar View</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
                <Button
                variant="ghost"
                size="sm"
                className="text-[#FFD700] hover:bg-black/20 rounded-xl"
                onClick={() => navigateMonth("prev")}
                >
                <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-semibold text-base text-[#FFD700] min-w-48 text-center">
                {formatMonthYear(currentDate)}
                </span>
                <Button
                variant="ghost"
                size="sm"
                className="text-[#FFD700] hover:bg-black/20 rounded-xl"
                onClick={() => navigateMonth("next")}
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
                <div className="grid grid-cols-7 bg-gradient-to-r from-black via-zinc-900 to-black text-gold font-semibold">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="p-3 text-center border border-gold/20">
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
                    return <div key={i} className="min-h-32 bg-black border border-gold/10" />
                }

                return (
                    <div
                    key={i}
                    className={`min-h-32 p-2 border border-gold/10 transition-all duration-200 group cursor-pointer ${
                        isWeekend ? "bg-black/70" : "bg-black"
                    } ${
                        isCurrentDay
                        ? "ring-2 ring-gold bg-gradient-to-br from-yellow-600 to-yellow-800"
                        : isSelected
                        ? "ring-2 ring-gold/70 bg-zinc-900"
                        : ""
                    } hover:bg-gradient-to-br hover:from-gold/10 hover:to-black`}
                    onClick={() => handleDateClick(dayNumber)}
                    >
                    <div className={`flex items-center justify-between mb-2 ${isCurrentDay ? "text-black" : "text-gold/70"}`}>
                        <span
                        className={`text-sm font-bold ${
                            isCurrentDay || isSelected
                            ? "bg-gold text-black rounded-full w-6 h-6 flex items-center justify-center text-xs"
                            : ""
                        }`}
                        >
                        {dayNumber}
                        </span>
                        {dayBookings.length > 0 && (
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-pulse" />
                            <span className="text-xs font-medium text-gold/60">{dayBookings.length}</span>
                        </div>
                        )}
                    </div>

                    {/* Bookings */}
                    <div className="space-y-1">
                        {dayBookings.slice(0, 3).map((booking) => {
                        const statusColors = {
                            completed: "from-green-500 to-green-300",
                            confirmed: "from-blue-600 to-blue-400",
                            pending: "from-yellow-500 to-yellow-300",
                            cancelled: "from-red-500 to-red-300",
                        }

                        return (
                            <div
                            key={booking.id}
                            className={`text-xs p-2 rounded-lg text-black font-semibold shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 bg-gradient-to-r ${
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
                            className="text-xs text-center p-1 bg-gradient-to-r from-gold to-yellow-600 text-black rounded-lg font-medium hover:from-yellow-700 hover:to-yellow-800"
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
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-center p-2 border-2 border-dashed border-gold/40 text-gold/60 hover:border-gold hover:text-gold"
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
            <div className="p-4 bg-black border-t border-gold/20">
            <div className="flex items-center justify-center space-x-6 text-sm text-gold/60">
                {[
                ["Completed", "from-green-400 to-green-600"],
                ["Confirmed", "from-blue-400 to-blue-600"],
                ["Pending", "from-yellow-400 to-yellow-600"],
                ["Cancelled", "from-red-400 to-red-600"],
                ].map(([label, gradient]) => (
                <div key={label} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 bg-gradient-to-r ${gradient} rounded-full`} />
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
