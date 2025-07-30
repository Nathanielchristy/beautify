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
  const [isAddBookingDialogOpen, setIsAddBookingDialogOpen] = useState(false)
  const [isEditBookingDialogOpen, setIsEditBookingDialogOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null)
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
            className="bg-gradient-to-r from-[#f5d76e] to-[#d4af37] hover:from-[#e6c14c] hover:to-[#bfa235] text-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-200
"
            onClick={() => setIsAddBookingOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
            New Booking
          </Button>
        </div>
      </div>

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
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setBookingToDelete(booking)
                          setIsDeleteConfirmOpen(true)
                        }}
                      >
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

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <DialogContent className="sm:max-w-md mx-4 bg-black/90 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">Confirm Delete</DialogTitle>
              <p className="text-white">
                Are you sure you want to delete the booking for <span className="font-semibold">{bookingToDelete?.clientName}</span>? This action cannot be undone.
              </p>
            </DialogHeader>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="rounded-xl hover:bg-roseLight-DEFAULT/30"
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-danger-DEFAULT to-danger-light hover:from-roseDeep-DEFAULT hover:to-danger-DEFAULT text-black rounded-xl bg-[#FFD700]"
                onClick={() => {
                  if (bookingToDelete) {
                    handleDeleteBooking(bookingToDelete.id)
                  }
                  setIsDeleteConfirmOpen(false)
                }}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  )
}
