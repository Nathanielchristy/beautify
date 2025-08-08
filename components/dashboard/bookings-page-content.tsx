"use client"
import { useState, useMemo, useEffect, type Dispatch, type SetStateAction } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus, ChevronLeft, ChevronRight, Edit, Trash2, Search } from "lucide-react"
import type { Booking, Client, Service, Staff } from "@/types"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"

interface BookingsPageContentProps {
  bookings: Booking[]
  setBookings: Dispatch<SetStateAction<Booking[]>>
  clients: Client[]
  services: Service[]
  staff: Staff[]
  initialAction: string | null
  setInitialAction: (action: string | null) => void
  setSelectedItem: (item: any) => void
  setIsViewDetailsOpen: (isOpen: boolean) => void
  handleUpdateBookingStatus: (id: string, status: Booking["status"]) => void
}

export function BookingsPageContent({
  bookings,
  setBookings,
  clients,
  services,
  staff,
  initialAction,
  setInitialAction,
  setSelectedItem,
  setIsViewDetailsOpen,
  handleUpdateBookingStatus,
}: BookingsPageContentProps) {
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false)
  const [isEditBookingDialogOpen, setIsEditBookingDialogOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null)
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null)
  const [newBooking, setNewBooking] = useState<Partial<Booking>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (initialAction === "add") {
      setIsAddBookingOpen(true)
      setInitialAction(null)
    }
  }, [initialAction, setInitialAction])

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9)

  const handleAddBooking = () => {
    if (
      !newBooking.clientId ||
      !newBooking.serviceId ||
      !newBooking.staffId ||
      !newBooking.date ||
      !newBooking.timeFrom ||
      !newBooking.timeTo
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const client = clients.find((c) => c.id === newBooking.clientId)
    const service = services.find((s) => s.id === newBooking.serviceId)
    const staffMember = staff.find((s) => s.id === newBooking.staffId)

    const booking: Booking = {
      id: generateId(),
      clientId: newBooking.clientId,
      clientName: client?.name || "",
      serviceId: newBooking.serviceId,
      serviceName: service?.name || "",
      staffId: newBooking.staffId,
      staffName: staffMember?.name || "",
      date: newBooking.date,
      time: `${newBooking.timeFrom} - ${newBooking.timeTo}`,
      status: "pending",
      price: service?.price || 0,
      notes: newBooking.notes || "",
    }

    setBookings([...bookings, booking])
    setNewBooking({})
    setIsAddBookingOpen(false)
    toast({
      title: "Success",
      description: "Booking created successfully",
    })
  }

  const handleEditBooking = () => {
    if (currentBooking) {
      const client = clients.find((c) => c.id === currentBooking.clientId)
      const service = services.find((s) => s.id === currentBooking.serviceId)
      const staffMember = staff.find((s) => s.id === currentBooking.staffId)

      setBookings(
        bookings.map((booking) =>
          booking.id === currentBooking.id
            ? {
                ...currentBooking,
                clientName: client?.name || "",
                serviceName: service?.name || "",
                staffName: staffMember?.name || "",
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
            className="bg-gradient-to-r from-white to-[#f9f9f9] hover:from-[#f0f0f0] hover:to-[#e6e6e6] text-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => setIsAddBookingOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
            New Booking
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-6 bg-black/95">
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

      {/* Add Booking Modal */}
      <Dialog open={isAddBookingOpen} onOpenChange={setIsAddBookingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Booking</DialogTitle>
            <DialogDescription>Schedule a new appointment.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="bookingClient">
                Client *
              </Label>
              <Select onValueChange={(value) => setNewBooking({ ...newBooking, clientId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="bookingService">
                Service *
              </Label>
              <Select onValueChange={(value) => setNewBooking({ ...newBooking, serviceId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - ${service.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="bookingStaff">
                Staff Member *
              </Label>
              <Select onValueChange={(value) => setNewBooking({ ...newBooking, staffId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staff.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} - {member.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bookingDate">
                  Date *
                </Label>
                <Input
                  id="bookingDate"
                  type="date"
                  value={newBooking.date || ""}
                  onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                />
              </div>
              <div>
                <Label>Time Slot *</Label>
                <div className="grid grid-cols-1 gap-2 mt-1">
                  <Select
                    onValueChange={(value) => {
                      const [timeFrom, timeTo] = value.split("-")
                      setNewBooking({ ...newBooking, timeFrom, timeTo })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00-10:00">9:00 AM - 10:00 AM</SelectItem>
                      <SelectItem value="10:00-11:00">10:00 AM - 11:00 AM</SelectItem>
                      <SelectItem value="11:00-12:00">11:00 AM - 12:00 PM</SelectItem>
                      <SelectItem value="12:00-13:00">12:00 PM - 1:00 PM</SelectItem>
                      <SelectItem value="13:00-14:00">1:00 PM - 2:00 PM</SelectItem>
                      <SelectItem value="14:00-15:00">2:00 PM - 3:00 PM</SelectItem>
                      <SelectItem value="15:00-16:00">3:00 PM - 4:00 PM</SelectItem>
                      <SelectItem value="16:00-17:00">4:00 PM - 5:00 PM</SelectItem>
                      <SelectItem value="17:00-18:00">5:00 PM - 6:00 PM</SelectItem>
                      <SelectItem value="18:00-19:00">6:00 PM - 7:00 PM</SelectItem>
                      <SelectItem value="19:00-20:00">7:00 PM - 8:00 PM</SelectItem>
                      <SelectItem value="20:00-21:00">8:00 PM - 9:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="bookingNotes">
                Notes
              </Label>
              <Textarea
                id="bookingNotes"
                placeholder="Additional notes..."
                value={newBooking.notes || ""}
                onChange={(e) => setNewBooking({ ...newBooking, notes: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddBookingOpen(false)
                  setNewBooking({})
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddBooking}
              >
                Create Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Booking Dialog */}
      <Dialog open={isEditBookingDialogOpen} onOpenChange={setIsEditBookingDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-black/95">
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
                    {clients.map((client) => (
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
                    {services.map((service) => (
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
                    {staff.map((staff) => (
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
                className="bg-[#FFD700] text-black"
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
