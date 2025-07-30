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

interface BookingsPageContentProps {
  bookings: Booking[]
  setIsAddBookingOpen: (isOpen: boolean) => void
  setSelectedItem: (item: any) => void
  setIsViewDetailsOpen: (isOpen: boolean) => void
  handleUpdateBookingStatus: (id: string, status: Booking["status"]) => void
  setBookings: (bookings: Booking[]) => void // Declare setBookings in props
}

export function BookingsPageContent({
  bookings,
  setIsAddBookingOpen,
  setSelectedItem,
  setIsViewDetailsOpen,
  handleUpdateBookingStatus,
  setBookings, // Use setBookings from props
}: BookingsPageContentProps) {
  const [isCalendarView, setIsCalendarView] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all")
  const [isAddBookingDialogOpen, setIsAddBookingDialogOpen] = useState(false)
  const [isEditBookingDialogOpen, setIsEditBookingDialogOpen] = useState(false)
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null)
  const [newBooking, setNewBooking] = useState<Omit<Booking, "id">>({
    clientId: "",
    clientName: "",
    serviceId: "",
    serviceName: "",
    staffId: "",
    staffName: "",
    date: "",
    time: "",
    status: "Pending",
    notes: "",
  })
  const [searchTerm, setSearchTerm] = useState("")

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
    // Auto-fill the booking form with the selected date
    // This logic would need to be lifted to the parent component (dashboard.tsx)
    // or passed as a prop to setIsAddBookingOpen
    setIsAddBookingOpen(true)
  }

  const handleAddBooking = () => {
    const id = (bookings.length + 1).toString()
    const client = mockClients.find((c) => c.id === newBooking.clientId)
    const service = mockServices.find((s) => s.id === newBooking.serviceId)
    const staff = mockStaff.find((s) => s.id === newBooking.staffId)

    setBookings([
      ...bookings,
      {
        id,
        ...newBooking,
        clientName: client?.name || "",
        serviceName: service?.name || "",
        staffName: staff?.name || "",
      },
    ])
    setNewBooking({
      clientId: "",
      clientName: "",
      serviceId: "",
      serviceName: "",
      staffId: "",
      staffName: "",
      date: "",
      time: "",
      status: "",
      notes: "",
    })
    setIsAddBookingDialogOpen(false)
  }

  const handleEditBooking = () => {
    if (currentBooking) {
      const client = mockClients.find((c) => c.id === currentBooking.clientId)
      const service = mockServices.find((s) => s.id === currentBooking.serviceId)
      const staff = mockStaff.find((s) => s.id === currentBooking.staffId)

      setBookings(
        bookings.map((booking) =>
          booking.id === currentBooking.id
            ? {
                ...currentBooking,
                clientName: client?.name || "",
                serviceName: service?.name || "",
                staffName: staff?.name || "",
              }
            : booking,
        ),
      )
      setCurrentBooking(null)
      setIsEditBookingDialogOpen(false)
    }
  }

  const handleDeleteBooking = (id: string) => {
    setBookings(bookings.filter((booking) => booking.id !== id))
  }

  const filteredBookingsList = bookings.filter(
    (booking) =>
      booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Booking Management</h2>
          <p className="text-gray-600">Manage appointments and schedules</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="rounded-xl border-roseLight-DEFAULT bg-transparent hover:bg-roseLight-DEFAULT/30"
            onClick={() => setIsCalendarView(!isCalendarView)}
          >
            <Calendar className="h-4 w-4 mr-2" strokeWidth={2} />
            {isCalendarView ? "List View" : "Calendar View"}
          </Button>
          <Button
            className="bg-gradient-to-r from-[#f5d76e] to-[#d4af37] hover:from-[#e6c14c] hover:to-[#bfa235] text-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-200
"
            onClick={() => setIsAddBookingOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
            New Booking
          </Button>
        </div>
      </div>

      {isCalendarView ? (
<Card className="bg-black/80 backdrop-blur border border-gold/30 shadow-xl rounded-2xl overflow-hidden">
  <CardHeader className="bg-gradient-to-r from-gold to-yellow-600 text-black shadow-md">
    <div className="flex items-center justify-between">
      <CardTitle className="flex items-center space-x-2 text-lg font-bold">
        <Calendar className="w-5 h-5 text-black" />
        <span>Calendar View</span>
      </CardTitle>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-black hover:bg-black/20 rounded-xl"
          onClick={() => navigateMonth("prev")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-semibold text-base text-black min-w-48 text-center">
          {formatMonthYear(currentDate)}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="text-black hover:bg-black/20 rounded-xl"
          onClick={() => navigateMonth("next")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </CardHeader>

  <CardContent className="p-0">
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
  </CardContent>
</Card>

      ) : (
        <div className="p-4 md:p-6 bg-black/50">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Bookings</h1>

          </div>

          <div className="relative mb-4">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="rounded-lg border overflow-hidden ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookingsList.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.clientName}</TableCell>
                    <TableCell>{booking.serviceName}</TableCell>
                    <TableCell>{booking.staffName}</TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell>{booking.time}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setCurrentBooking(booking)
                            setIsEditBookingDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteBooking(booking.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Add Booking Dialog */}
          <Dialog open={isAddBookingDialogOpen} onOpenChange={setIsAddBookingDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Booking</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="client" className="text-right">
                    Client
                  </Label>
                  <Select
                    onValueChange={(value) => setNewBooking({ ...newBooking, clientId: value })}
                    value={newBooking.clientId}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="service" className="text-right">
                    Service
                  </Label>
                  <Select
                    onValueChange={(value) => setNewBooking({ ...newBooking, serviceId: value })}
                    value={newBooking.serviceId}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockServices.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="staff" className="text-right">
                    Staff
                  </Label>
                  <Select
                    onValueChange={(value) => setNewBooking({ ...newBooking, staffId: value })}
                    value={newBooking.staffId}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select staff" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStaff.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newBooking.date}
                    onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={newBooking.time}
                    onChange={(e) => setNewBooking({ ...newBooking, time: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    onValueChange={(value) => setNewBooking({ ...newBooking, status: value as Booking["status"] })}
                    value={newBooking.status}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Input
                    id="notes"
                    value={newBooking.notes}
                    onChange={(e) => setNewBooking({ ...newBooking, notes: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleAddBooking}
                  className="bg-roseDark hover:bg-roseMedium text-roseBackground-foreground"
                >
                  Add Booking
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Booking Dialog */}
          <Dialog open={isEditBookingDialogOpen} onOpenChange={setIsEditBookingDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Booking</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-client" className="text-right">
                    Client
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setCurrentBooking(currentBooking ? { ...currentBooking, clientId: value } : null)
                    }
                    value={currentBooking?.clientId || ""}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-service" className="text-right">
                    Service
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setCurrentBooking(currentBooking ? { ...currentBooking, serviceId: value } : null)
                    }
                    value={currentBooking?.serviceId || ""}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockServices.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-staff" className="text-right">
                    Staff
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setCurrentBooking(currentBooking ? { ...currentBooking, staffId: value } : null)
                    }
                    value={currentBooking?.staffId || ""}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select staff" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStaff.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={currentBooking?.date || ""}
                    onChange={(e) =>
                      setCurrentBooking(currentBooking ? { ...currentBooking, date: e.target.value } : null)
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-time" className="text-right">
                    Time
                  </Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={currentBooking?.time || ""}
                    onChange={(e) =>
                      setCurrentBooking(currentBooking ? { ...currentBooking, time: e.target.value } : null)
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">
                    Status
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setCurrentBooking(
                        currentBooking ? { ...currentBooking, status: value as Booking["status"] } : null,
                      )
                    }
                    value={currentBooking?.status || ""}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-notes" className="text-right">
                    Notes
                  </Label>
                  <Input
                    id="edit-notes"
                    value={currentBooking?.notes || ""}
                    onChange={(e) =>
                      setCurrentBooking(currentBooking ? { ...currentBooking, notes: e.target.value } : null)
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleEditBooking}
                  className="bg-roseDark hover:bg-roseMedium text-roseBackground-foreground"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}
