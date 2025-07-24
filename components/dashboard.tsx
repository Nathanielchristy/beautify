"use client"

import { useState } from "react"
import { LogOut, Home, Calendar, Users, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Card, CardContent } from "@/components/ui/card"

// Import types and mock data
import type { Client, Staff, Service, Booking, InventoryItem, Invoice } from "@/types"
import { mockClients, mockStaff, mockServices, mockBookings, mockInventory, mockInvoices } from "@/data/mockData"

// Import refactored components
import { TopBar } from "./dashboard/top-bar"
import { DashboardOverviewSection } from "./dashboard/dashboard-overview-section"
import { ClientPageContent } from "./dashboard/client-page-content"
import { StaffPageContent } from "./dashboard/staff-page-content"
import { ServicesPageContent } from "./dashboard/services-page-content"
import { BookingsPageContent } from "./dashboard/bookings-page-content"
import { InventoryPageContent } from "./dashboard/inventory-page-content"
import { InvoicesPageContent } from "./dashboard/invoices-page-content"
import { ReportsPageContent } from "./dashboard/reports-page-content"

// Update imports for the new sidebar structure
// 1. Remove `import { SidebarContent } from "./dashboard/sidebar-content"`
// 2. Add `import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"`
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
// 3. Add `import { AppSidebar } from "./app-sidebar"`
import { AppSidebar } from "./app-sidebar"

const bottomNavItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "clients", label: "Clients", icon: Users },
  { id: "reports", label: "Reports", icon: BarChart3 },
]

interface DashboardProps {
  onLogout: () => void
  userEmail: string
}

export default function BeautyWellnessDashboard({ onLogout, userEmail }: DashboardProps) {
  // State management
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Data states
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [staff, setStaff] = useState<Staff[]>(mockStaff)
  const [services, setServices] = useState<Service[]>(mockServices)
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)

  // Modal states
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isAddClientOpen, setIsAddClientOpen] = useState(false)
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false)
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false)
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false)
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false)
  const [isAddInventoryOpen, setIsAddInventoryOpen] = useState(false)
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [isUpdateQuantityOpen, setIsUpdateQuantityOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isManageOrderOpen, setIsManageOrderOpen] = useState(false)
  const [reorderingServices, setReorderingServices] = useState<Service[]>([])

  // Item states
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null)
  const [deleteItem, setDeleteItem] = useState<{ type: string; id: string; name: string } | null>(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [editingService, setEditingService] = useState<Service | null>(null)

  // Form states
  const [newClient, setNewClient] = useState<Partial<Client>>({})
  const [newStaff, setNewStaff] = useState<Partial<Staff>>({})
  const [newService, setNewService] = useState<Partial<Service>>({})
  const [newBooking, setNewBooking] = useState<Partial<Booking>>({})
  const [newInventoryItem, setNewInventoryItem] = useState<Partial<InventoryItem>>({})
  const [newQuantity, setNewQuantity] = useState("")
  const [newCategory, setNewCategory] = useState("")

  // Service categories state
  const [serviceCategories, setServiceCategories] = useState([
    "Hair",
    "Skin",
    "Nails",
    "Spa",
    "Massage",
    "Eyebrows & Eyelashes",
  ])

  const [selectedCategory, setSelectedCategory] = useState("all")

  const handleLogout = () => {
    setShowLogoutConfirm(false)
    onLogout()
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setIsMobileMenuOpen(false)
  }

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9)

  // Client functions
  const handleAddClient = () => {
    if (!newClient.name || !newClient.email || !newClient.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const client: Client = {
      id: generateId(),
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone,
      avatar: `/placeholder.svg?height=40&width=40&text=${newClient.name?.charAt(0)}`,
      firstVisit: new Date().toISOString().split("T")[0],
      servicesCount: 0,
      totalSpent: 0,
      lastVisit: new Date().toISOString().split("T")[0],
      notes: newClient.notes || "",
      status: "active",
    }

    setClients([...clients, client])
    setNewClient({})
    setIsAddClientOpen(false)
    toast({
      title: "Success",
      description: "Client added successfully",
    })
  }

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter((client) => client.id !== id))
    toast({
      title: "Success",
      description: "Client deleted successfully",
    })
  }

  // Staff functions
  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.email || !newStaff.specialty) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const staffMember: Staff = {
      id: generateId(),
      name: newStaff.name,
      email: newStaff.email,
      phone: newStaff.phone || "",
      avatar: `/placeholder.svg?height=40&width=40&text=${newStaff.name?.charAt(0)}`,
      specialty: newStaff.specialty,
      availability: newStaff.availability || "Mon-Fri",
      rating: 5.0,
      hireDate: new Date().toISOString().split("T")[0],
      isActive: true,
      totalRevenue: 0,
      color: "bg-roseLight-DEFAULT text-roseDeep-DEFAULT", // Default color for new staff
    }

    setStaff([...staff, staffMember])
    setNewStaff({})
    setIsAddStaffOpen(false)
    toast({
      title: "Success",
      description: "Staff member added successfully",
    })
  }

  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter((member) => member.id !== id))
    toast({
      title: "Success",
      description: "Staff member deleted successfully",
    })
  }

  // Service functions
  const handleAddService = () => {
    if (!newService.name || !newService.category || !newService.price || !newService.duration) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const service: Service = {
      id: generateId(),
      name: newService.name,
      category: newService.category,
      price: Number(newService.price),
      duration: Number(newService.duration),
      description: newService.description || "",
      isActive: true,
      icon: "✨",
      color: "bg-roseLight-DEFAULT text-roseDeep-DEFAULT", // Default color for new service
    }

    setServices([...services, service])
    setNewService({})
    setIsAddServiceOpen(false)
    toast({
      title: "Success",
      description: "Service added successfully",
    })
  }

  const handleDeleteService = (id: string) => {
    setServices(services.filter((service) => service.id !== id))
    toast({
      title: "Success",
      description: "Service deleted successfully",
    })
  }

  const handleEditService = () => {
    if (
      !editingService ||
      !editingService.name ||
      !editingService.category ||
      !editingService.price ||
      !editingService.duration
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const updatedService: Service = {
      ...editingService,
      price: Number(editingService.price),
      duration: Number(editingService.duration),
    }

    setServices(services.map((service) => (service.id === editingService.id ? updatedService : service)))
    setEditingService(null)
    setIsEditServiceOpen(false)
    toast({
      title: "Success",
      description: "Service updated successfully",
    })
  }

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive",
      })
      return
    }

    if (serviceCategories.includes(newCategory)) {
      toast({
        title: "Error",
        description: "Category already exists",
        variant: "destructive",
      })
      return
    }

    setServiceCategories([...serviceCategories, newCategory])
    setNewCategory("")
    setIsAddCategoryOpen(false)
    toast({
      title: "Success",
      description: "Category added successfully",
    })
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(reorderingServices)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setReorderingServices(items)
  }

  const handleSaveOrder = () => {
    const otherServices =
      selectedCategory === "all" ? [] : services.filter((service) => service.category !== selectedCategory)

    const updatedServices = selectedCategory === "all" ? reorderingServices : [...otherServices, ...reorderingServices]

    setServices(updatedServices)
    setIsManageOrderOpen(false)
    setReorderingServices([])

    toast({
      title: "Success",
      description: "Service order updated successfully",
    })
  }

  // Booking functions
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

  const handleUpdateBookingStatus = (id: string, status: Booking["status"]) => {
    setBookings(bookings.map((booking) => (booking.id === id ? { ...booking, status } : booking)))
    toast({
      title: "Success",
      description: `Booking status updated to ${status}`,
    })
  }

  // Inventory functions
  const handleAddInventoryItem = () => {
    if (!newInventoryItem.name || !newInventoryItem.category || !newInventoryItem.supplier) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const quantity = Number(newInventoryItem.quantity) || 0
    const reorderLevel = Number(newInventoryItem.reorderLevel) || 0

    let status: InventoryItem["status"] = "in-stock"
    if (quantity === 0) status = "out-of-stock"
    else if (quantity <= reorderLevel) status = "low-stock"

    const item: InventoryItem = {
      id: generateId(),
      name: newInventoryItem.name,
      category: newInventoryItem.category,
      quantity,
      supplier: newInventoryItem.supplier,
      reorderLevel,
      unitPrice: Number(newInventoryItem.unitPrice) || 0,
      lastRestocked: new Date().toISOString().split("T")[0],
      status,
    }

    setInventory([...inventory, item])
    setNewInventoryItem({})
    setIsAddInventoryOpen(false)
    toast({
      title: "Success",
      description: "Inventory item added successfully",
    })
  }

  const handleUpdateInventoryQuantity = (id: string, newQuantity: number) => {
    setInventory(
      inventory.map((item) => {
        if (item.id === id) {
          let status: InventoryItem["status"] = "in-stock"
          if (newQuantity === 0) status = "out-of-stock"
          else if (newQuantity <= item.reorderLevel) status = "low-stock"

          return { ...item, quantity: newQuantity, status }
        }
        return item
      }),
    )
    toast({
      title: "Success",
      description: "Inventory updated successfully",
    })
  }

  const openUpdateQuantityModal = (item: InventoryItem) => {
    setSelectedInventoryItem(item)
    setNewQuantity(item.quantity.toString())
    setIsUpdateQuantityOpen(true)
  }

  const handleQuantityUpdate = () => {
    if (!selectedInventoryItem || !newQuantity || isNaN(Number(newQuantity))) {
      toast({
        title: "Error",
        description: "Please enter a valid quantity",
        variant: "destructive",
      })
      return
    }

    handleUpdateInventoryQuantity(selectedInventoryItem.id, Number(newQuantity))
    setIsUpdateQuantityOpen(false)
    setSelectedInventoryItem(null)
    setNewQuantity("")
  }

  // Invoice functions
  const handleCreateInvoice = () => {
    const completedBookings = bookings.filter(
      (b) => b.status === "completed" && !invoices.find((i) => i.bookingId === b.id),
    )

    if (completedBookings.length === 0) {
      toast({
        title: "Info",
        description: "No completed bookings available for invoicing",
      })
      return
    }

    const booking = completedBookings[0]
    const invoice: Invoice = {
      id: `INV-${String(invoices.length + 1).padStart(3, "0")}`,
      clientId: booking.clientId,
      clientName: booking.clientName,
      bookingId: booking.id,
      total: booking.price,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      items: [
        {
          serviceId: booking.serviceId,
          serviceName: booking.serviceName,
          quantity: 1,
          price: booking.price,
          total: booking.price,
        },
      ],
    }

    setInvoices([...invoices, invoice])
    setIsCreateInvoiceOpen(false)
    toast({
      title: "Success",
      description: "Invoice created successfully",
    })
  }

  const handleUpdateInvoiceStatus = (id: string, status: Invoice["status"]) => {
    setInvoices(invoices.map((invoice) => (invoice.id === id ? { ...invoice, status } : invoice)))
    toast({
      title: "Success",
      description: `Invoice status updated to ${status}`,
    })
  }

  const openDeleteConfirm = (type: string, id: string, name: string) => {
    setDeleteItem({ type, id, name })
    setIsDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!deleteItem) return

    switch (deleteItem.type) {
      case "client":
        handleDeleteClient(deleteItem.id)
        break
      case "staff":
        handleDeleteStaff(deleteItem.id)
        break
      case "service":
        handleDeleteService(deleteItem.id)
        break
    }

    setIsDeleteConfirmOpen(false)
    setDeleteItem(null)
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardOverviewSection
            clients={clients}
            bookings={bookings}
            invoices={invoices}
            staff={staff}
            setIsAddBookingOpen={setIsAddBookingOpen}
            setIsAddClientOpen={setIsAddClientOpen}
            setIsAddServiceOpen={setIsAddServiceOpen}
            setIsCreateInvoiceOpen={setIsCreateInvoiceOpen}
            setSelectedItem={setSelectedItem}
            setIsViewDetailsOpen={setIsViewDetailsOpen}
          />
        )
      case "clients":
        return (
          <ClientPageContent
            clients={clients}
            setIsAddClientOpen={setIsAddClientOpen}
            setSelectedItem={setSelectedItem}
            setIsViewDetailsOpen={setIsViewDetailsOpen}
            openDeleteConfirm={openDeleteConfirm}
          />
        )
      case "staff":
        return (
          <StaffPageContent
            staff={staff}
            setIsAddStaffOpen={setIsAddStaffOpen}
            setSelectedItem={setSelectedItem}
            setIsViewDetailsOpen={setIsViewDetailsOpen}
            openDeleteConfirm={openDeleteConfirm}
          />
        )
      case "services":
        return (
          <ServicesPageContent
            services={services}
            serviceCategories={serviceCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setIsAddCategoryOpen={setIsAddCategoryOpen}
            setIsAddServiceOpen={setIsAddServiceOpen}
            setEditingService={setEditingService}
            setIsEditServiceOpen={setIsEditServiceOpen}
            openDeleteConfirm={openDeleteConfirm}
            setIsManageOrderOpen={setIsManageOrderOpen}
            setReorderingServices={setReorderingServices}
          />
        )
      case "bookings":
        return (
          <BookingsPageContent
            bookings={bookings}
            setIsAddBookingOpen={setIsAddBookingOpen}
            setSelectedItem={setSelectedItem}
            setIsViewDetailsOpen={setIsViewDetailsOpen}
            handleUpdateBookingStatus={handleUpdateBookingStatus}
          />
        )
      case "inventory":
        return (
          <InventoryPageContent
            inventory={inventory}
            setIsAddInventoryOpen={setIsAddInventoryOpen}
            openUpdateQuantityModal={openUpdateQuantityModal}
            handleUpdateInventoryQuantity={handleUpdateInventoryQuantity}
          />
        )
      case "invoices":
        return (
          <InvoicesPageContent
            invoices={invoices}
            setIsCreateInvoiceOpen={setIsCreateInvoiceOpen}
            setSelectedItem={setSelectedItem}
            setIsViewDetailsOpen={setIsViewDetailsOpen}
            handleUpdateInvoiceStatus={handleUpdateInvoiceStatus}
          />
        )
      case "reports":
        return <ReportsPageContent bookings={bookings} invoices={invoices} services={services} staff={staff} />
      default:
        return (
          <DashboardOverviewSection
            clients={clients}
            bookings={bookings}
            invoices={invoices}
            staff={staff}
            setIsAddBookingOpen={setIsAddBookingOpen}
            setIsAddClientOpen={setIsAddClientOpen}
            setIsAddServiceOpen={setIsAddServiceOpen}
            setIsCreateInvoiceOpen={setIsCreateInvoiceOpen}
            setSelectedItem={setSelectedItem}
            setIsViewDetailsOpen={setIsViewDetailsOpen}
          />
        )
    }
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar activeTab={activeTab} handleTabChange={handleTabChange} setShowLogoutConfirm={setShowLogoutConfirm} />
      <SidebarInset>
        <TopBar
          activeTab={activeTab}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          userEmail={userEmail}
        />
        <main className="flex-1 overflow-auto p-4 sm:p-6">{renderContent()}</main>
        {/* Mobile Bottom Navigation - Keep this as it's a separate navigation */}
        <div className="lg:hidden bg-white/90 backdrop-blur-xl border-t border-indigo-light px-4 py-2 shadow-lg">
          <div className="flex items-center justify-around">
            {bottomNavItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-primary-blue to-indigo-dark text-white shadow-md"
                      : "text-gray-600 hover:bg-indigo-light/30"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </SidebarInset>

      {/* All Modals */}
      {/* Logout Confirmation Modal */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="sm:max-w-md mx-4 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Confirm Logout</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to logout? You will need to sign in again to access the dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowLogoutConfirm(false)}
              className="rounded-xl border-roseLight-DEFAULT hover:bg-roseLight-DEFAULT/30"
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-danger-DEFAULT to-danger-light hover:from-roseDeep-DEFAULT hover:to-danger-DEFAULT text-white rounded-xl bg-[rgba(231,12,132,1)]"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" strokeWidth={2} />
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Client Modal */}
      <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
        <DialogContent className="sm:max-w-md mx-4 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Add New Client</DialogTitle>
            <DialogDescription className="text-gray-600">
              Enter client information to add them to your system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="clientName" className="text-gray-700 font-medium">
                Full Name *
              </Label>
              <Input
                id="clientName"
                placeholder="Enter client name"
                value={newClient.name || ""}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div>
              <Label htmlFor="clientEmail" className="text-gray-700 font-medium">
                Email *
              </Label>
              <Input
                id="clientEmail"
                type="email"
                placeholder="client@example.com"
                value={newClient.email || ""}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div>
              <Label htmlFor="clientPhone" className="text-gray-700 font-medium">
                Phone Number *
              </Label>
              <Input
                id="clientPhone"
                placeholder="(555) 123-4567"
                value={newClient.phone || ""}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div>
              <Label htmlFor="clientNotes" className="text-gray-700 font-medium">
                Notes
              </Label>
              <Textarea
                id="clientNotes"
                placeholder="Additional notes..."
                value={newClient.notes || ""}
                onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddClientOpen(false)
                  setNewClient({})
                }}
                className="rounded-xl border-roseLight-DEFAULT hover:bg-roseLight-DEFAULT/30"
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-roseDark-DEFAULT to-roseMedium-DEFAULT hover:from-roseDeep-DEFAULT hover:to-roseDark-DEFAULT text-white rounded-xl"
                onClick={handleAddClient}
              >
                Add Client
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Staff Modal */}
      <Dialog open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
        <DialogContent className="sm:max-w-md mx-4 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Add Staff Member</DialogTitle>
            <DialogDescription className="text-gray-600">Enter staff member information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="staffName" className="text-gray-700 font-medium">
                Full Name *
              </Label>
              <Input
                id="staffName"
                placeholder="Enter staff name"
                value={newStaff.name || ""}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div>
              <Label htmlFor="staffEmail" className="text-gray-700 font-medium">
                Email *
              </Label>
              <Input
                id="staffEmail"
                type="email"
                placeholder="staff@beautify.com"
                value={newStaff.email || ""}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div>
              <Label htmlFor="staffPhone" className="text-gray-700 font-medium">
                Phone Number
              </Label>
              <Input
                id="staffPhone"
                placeholder="(555) 123-4567"
                value={newStaff.phone || ""}
                onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div>
              <Label htmlFor="staffSpecialty" className="text-gray-700 font-medium">
                Specialty *
              </Label>
              <Select onValueChange={(value) => setNewStaff({ ...newStaff, specialty: value })}>
                <SelectTrigger className="mt-1 rounded-xl border-roseLight-DEFAULT bg-white/50 backdrop-blur-sm">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hair Stylist">Hair Stylist</SelectItem>
                  <SelectItem value="Esthetician">Esthetician</SelectItem>
                  <SelectItem value="Nail Technician">Nail Technician</SelectItem>
                  <SelectItem value="Massage Therapist">Massage Therapist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="staffAvailability" className="text-gray-700 font-medium">
                Working Days
              </Label>
              <Input
                id="staffAvailability"
                placeholder="e.g., Mon-Fri"
                value={newStaff.availability || ""}
                onChange={(e) => setNewStaff({ ...newStaff, availability: e.target.value })}
                className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddStaffOpen(false)
                  setNewStaff({})
                }}
                className="rounded-xl border-roseLight-DEFAULT hover:bg-roseLight-DEFAULT/30"
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-roseDark-DEFAULT to-roseMedium-DEFAULT hover:from-roseDeep-DEFAULT hover:to-roseDark-DEFAULT text-white rounded-xl"
                onClick={handleAddStaff}
              >
                Add Staff
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Service Modal */}
      <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
        <DialogContent className="sm:max-w-md mx-4 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Add New Service</DialogTitle>
            <DialogDescription className="text-gray-600">Create a new service offering.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="serviceName" className="text-gray-700 font-medium">
                Service Name *
              </Label>
              <Input
                id="serviceName"
                placeholder="Enter service name"
                value={newService.name || ""}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div>
              <Label htmlFor="serviceCategory" className="text-gray-700 font-medium">
                Category *
              </Label>
              <Select onValueChange={(value) => setNewService({ ...newService, category: value })}>
                <SelectTrigger className="mt-1 rounded-xl border-roseLight-DEFAULT bg-white/50 backdrop-blur-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="servicePrice" className="text-gray-700 font-medium">
                  Price *
                </Label>
                <Input
                  id="servicePrice"
                  type="number"
                  placeholder="0.00"
                  value={newService.price || ""}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                />
              </div>
              <div>
                <Label htmlFor="serviceDuration" className="text-gray-700 font-medium">
                  Duration (min) *
                </Label>
                <Input
                  id="serviceDuration"
                  type="number"
                  placeholder="60"
                  value={newService.duration || ""}
                  onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                  className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="serviceDescription" className="text-gray-700 font-medium">
                Description
              </Label>
              <Textarea
                id="serviceDescription"
                placeholder="Service description..."
                value={newService.description || ""}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddServiceOpen(false)
                  setNewService({})
                }}
                className="rounded-xl border-roseLight-DEFAULT hover:bg-roseLight-DEFAULT/30"
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-roseDark-DEFAULT to-roseMedium-DEFAULT hover:from-roseDeep-DEFAULT hover:to-roseDark-DEFAULT text-white rounded-xl"
                onClick={handleAddService}
              >
                Add Service
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Service Modal */}
      <Dialog open={isEditServiceOpen} onOpenChange={setIsEditServiceOpen}>
        <DialogContent className="sm:max-w-md mx-4 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Edit Service</DialogTitle>
            <DialogDescription className="text-gray-600">Update service information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="editServiceName" className="text-gray-700 font-medium">
                Service Name *
              </Label>
              <Input
                id="editServiceName"
                placeholder="Enter service name"
                value={editingService?.name || ""}
                onChange={(e) => setEditingService(editingService ? { ...editingService, name: e.target.value } : null)}
                className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div>
              <Label htmlFor="editServiceCategory" className="text-gray-700 font-medium">
                Category *
              </Label>
              <Select
                value={editingService?.category || ""}
                onValueChange={(value) =>
                  setEditingService(editingService ? { ...editingService, category: value } : null)
                }
              >
                <SelectTrigger className="mt-1 rounded-xl border-roseLight-DEFAULT bg-white/50 backdrop-blur-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editServicePrice" className="text-gray-700 font-medium">
                  Price *
                </Label>
                <Input
                  id="editServicePrice"
                  type="number"
                  placeholder="0.00"
                  value={editingService?.price || ""}
                  onChange={(e) =>
                    setEditingService(editingService ? { ...editingService, price: Number(e.target.value) } : null)
                  }
                  className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                />
              </div>
              <div>
                <Label htmlFor="editServiceDuration" className="text-gray-700 font-medium">
                  Duration (min) *
                </Label>
                <Input
                  id="editServiceDuration"
                  type="number"
                  placeholder="60"
                  value={editingService?.duration || ""}
                  onChange={(e) =>
                    setEditingService(editingService ? { ...editingService, duration: Number(e.target.value) } : null)
                  }
                  className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="editServiceDescription" className="text-gray-700 font-medium">
                Description
              </Label>
              <Textarea
                id="editServiceDescription"
                placeholder="Service description..."
                value={editingService?.description || ""}
                onChange={(e) =>
                  setEditingService(editingService ? { ...editingService, description: e.target.value } : null)
                }
                className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditServiceOpen(false)
                  setEditingService(null)
                }}
                className="rounded-xl border-roseLight-DEFAULT hover:bg-roseLight-DEFAULT/30"
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-roseDark-DEFAULT to-roseMedium-DEFAULT hover:from-roseDeep-DEFAULT hover:to-roseDark-DEFAULT text-white rounded-xl"
                onClick={handleEditService}
              >
                Update Service
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Category Modal */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-md mx-4 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Add New Category</DialogTitle>
            <DialogDescription className="text-gray-600">Create a new service category.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="categoryName" className="text-gray-700 font-medium">
                Category Name *
              </Label>
              <Input
                id="categoryName"
                placeholder="Enter category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddCategoryOpen(false)
                  setNewCategory("")
                }}
                className="rounded-xl border-roseLight-DEFAULT hover:bg-roseLight-DEFAULT/30"
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-roseDark-DEFAULT to-roseMedium-DEFAULT hover:from-roseDeep-DEFAULT hover:to-roseDark-DEFAULT text-white rounded-xl"
                onClick={handleAddCategory}
              >
                Add Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Booking Modal */}
      <Dialog open={isAddBookingOpen} onOpenChange={setIsAddBookingOpen}>
        <DialogContent className="sm:max-w-md mx-4 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Create New Booking</DialogTitle>
            <DialogDescription className="text-gray-600">Schedule a new appointment.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="bookingClient" className="text-gray-700 font-medium">
                Client *
              </Label>
              <Select onValueChange={(value) => setNewBooking({ ...newBooking, clientId: value })}>
                <SelectTrigger className="mt-1 rounded-xl border-roseLight-DEFAULT bg-white/50 backdrop-blur-sm">
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
              <Label htmlFor="bookingService" className="text-gray-700 font-medium">
                Service *
              </Label>
              <Select onValueChange={(value) => setNewBooking({ ...newBooking, serviceId: value })}>
                <SelectTrigger className="mt-1 rounded-xl border-roseLight-DEFAULT bg-white/50 backdrop-blur-sm">
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
              <Label htmlFor="bookingStaff" className="text-gray-700 font-medium">
                Staff Member *
              </Label>
              <Select onValueChange={(value) => setNewBooking({ ...newBooking, staffId: value })}>
                <SelectTrigger className="mt-1 rounded-xl border-roseLight-DEFAULT bg-white/50 backdrop-blur-sm">
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
                <Label htmlFor="bookingDate" className="text-gray-700 font-medium">
                  Date *
                </Label>
                <Input
                  id="bookingDate"
                  type="date"
                  value={newBooking.date || ""}
                  onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                  className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium">Time Slot *</Label>
                <div className="grid grid-cols-1 gap-2 mt-1">
                  <Select
                    onValueChange={(value) => {
                      const [timeFrom, timeTo] = value.split("-")
                      setNewBooking({ ...newBooking, timeFrom, timeTo })
                    }}
                  >
                    <SelectTrigger className="rounded-xl border-roseLight-DEFAULT bg-white/50 backdrop-blur-sm">
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
              <Label htmlFor="bookingNotes" className="text-gray-700 font-medium">
                Notes
              </Label>
              <Textarea
                id="bookingNotes"
                placeholder="Additional notes..."
                value={newBooking.notes || ""}
                onChange={(e) => setNewBooking({ ...newBooking, notes: e.target.value })}
                className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddBookingOpen(false)
                  setNewBooking({})
                }}
                className="rounded-xl border-roseLight-DEFAULT hover:bg-roseLight-DEFAULT/30"
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-roseDark-DEFAULT to-roseMedium-DEFAULT hover:from-roseDeep-DEFAULT hover:to-roseDark-DEFAULT text-white rounded-xl"
                onClick={handleAddBooking}
              >
                Create Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Inventory Item Modal */}
      <Dialog open={isAddInventoryOpen} onOpenChange={setIsAddInventoryOpen}>
        <DialogContent className="sm:max-w-md mx-4 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Add Inventory Item</DialogTitle>
            <DialogDescription className="text-gray-600">Add a new product to inventory.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="inventoryName" className="text-gray-700 font-medium">
                Product Name *
              </Label>
              <Input
                id="inventoryName"
                placeholder="Enter product name"
                value={newInventoryItem.name || ""}
                onChange={(e) => setNewInventoryItem({ ...newInventoryItem, name: e.target.value })}
                className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div>
              <Label htmlFor="inventoryCategory" className="text-gray-700 font-medium">
                Category *
              </Label>
              <Select onValueChange={(value) => setNewInventoryItem({ ...newInventoryItem, category: value })}>
                <SelectTrigger className="mt-1 rounded-xl border-roseLight-DEFAULT bg-white/50 backdrop-blur-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hair Care">Hair Care</SelectItem>
                  <SelectItem value="Skin Care">Skin Care</SelectItem>
                  <SelectItem value="Nail Care">Nail Care</SelectItem>
                  <SelectItem value="Spa">Spa</SelectItem>
                  <SelectItem value="Tools">Tools</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="inventorySupplier" className="text-gray-700 font-medium">
                Supplier *
              </Label>
              <Input
                id="inventorySupplier"
                placeholder="Enter supplier name"
                value={newInventoryItem.supplier || ""}
                onChange={(e) => setNewInventoryItem({ ...newInventoryItem, supplier: e.target.value })}
                className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inventoryQuantity" className="text-gray-700 font-medium">
                  Initial Quantity
                </Label>
                <Input
                  id="inventoryQuantity"
                  type="number"
                  placeholder="0"
                  value={newInventoryItem.quantity || ""}
                  onChange={(e) => setNewInventoryItem({ ...newInventoryItem, quantity: Number(e.target.value) })}
                  className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                />
              </div>
              <div>
                <Label htmlFor="inventoryReorder" className="text-gray-700 font-medium">
                  Reorder Level
                </Label>
                <Input
                  id="inventoryReorder"
                  type="number"
                  placeholder="5"
                  value={newInventoryItem.reorderLevel || ""}
                  onChange={(e) => setNewInventoryItem({ ...newInventoryItem, reorderLevel: Number(e.target.value) })}
                  className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="inventoryPrice" className="text-gray-700 font-medium">
                Unit Price
              </Label>
              <Input
                id="inventoryPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newInventoryItem.unitPrice || ""}
                onChange={(e) => setNewInventoryItem({ ...newInventoryItem, unitPrice: Number(e.target.value) })}
                className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddInventoryOpen(false)
                  setNewInventoryItem({})
                }}
                className="rounded-xl border-roseLight-DEFAULT hover:bg-roseLight-DEFAULT/30"
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-roseDark-DEFAULT to-roseMedium-DEFAULT hover:from-roseDeep-DEFAULT hover:to-roseDark-DEFAULT text-white rounded-xl"
                onClick={handleAddInventoryItem}
              >
                Add Item
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Invoice Modal */}
      <Dialog open={isCreateInvoiceOpen} onOpenChange={setIsCreateInvoiceOpen}>
        <DialogContent className="sm:max-w-md mx-4 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Create Invoice</DialogTitle>
            <DialogDescription className="text-gray-600">Generate invoice from completed bookings.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateInvoiceOpen(false)
              }}
              className="rounded-xl border-roseLight-DEFAULT hover:bg-roseLight-DEFAULT/30"
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-roseDark-DEFAULT to-roseMedium-DEFAULT hover:from-roseDeep-DEFAULT hover:to-roseDark-DEFAULT text-white rounded-xl"
              onClick={handleCreateInvoice}
            >
              Create Invoice
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-md mx-4 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">View Details</DialogTitle>
            <DialogDescription className="text-gray-600">
              Details for {selectedItem?.name || selectedItem?.clientName || selectedItem?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {activeTab === "clients" && (
              <>
                <div>
                  <Label className="text-gray-700 font-medium">Full Name</Label>
                  <Input
                    value={selectedItem?.name || ""}
                    readOnly
                    className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Email</Label>
                  <Input
                    value={selectedItem?.email || ""}
                    readOnly
                    className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Phone Number</Label>
                  <Input
                    value={selectedItem?.phone || ""}
                    readOnly
                    className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Notes</Label>
                  <Textarea
                    value={selectedItem?.notes || ""}
                    readOnly
                    className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </>
            )}

            {activeTab === "staff" && (
              <>
                <div>
                  <Label className="text-gray-700 font-medium">Full Name</Label>
                  <Input
                    value={selectedItem?.name || ""}
                    readOnly
                    className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Email</Label>
                  <Input
                    value={selectedItem?.email || ""}
                    readOnly
                    className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Specialty</Label>
                  <Input
                    value={selectedItem?.specialty || ""}
                    readOnly
                    className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Availability</Label>
                  <Input
                    value={selectedItem?.availability || ""}
                    readOnly
                    className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </>
            )}

            {activeTab === "bookings" && (
              <>
                <div>
                  <Label className="text-gray-700 font-medium">Client Name</Label>
                  <Input
                    value={selectedItem?.clientName || ""}
                    readOnly
                    className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Service Name</Label>
                  <Input
                    value={selectedItem?.serviceName || ""}
                    readOnly
                    className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Staff Name</Label>
                  <Input
                    value={selectedItem?.staffName || ""}
                    readOnly
                    className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Date</Label>
                  <Input
                    value={selectedItem?.date || ""}
                    readOnly
                    className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Time</Label>
                  <Input
                    value={selectedItem?.time || ""}
                    readOnly
                    className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Status</Label>
                  <Input
                    value={selectedItem?.status || ""}
                    readOnly
                    className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </>
            )}

            {activeTab === "invoices" && (
              <>
                <div>
                  <Label className="text-gray-700 font-medium">Invoice ID</Label>
                  <Input
                    value={selectedItem?.id || ""}
                    readOnly
                    className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Client Name</Label>
                  <Input
                    value={selectedItem?.clientName || ""}
                    readOnly
                    className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Total</Label>
                  <Input
                    value={selectedItem?.total || ""}
                    readOnly
                    className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Status</Label>
                  <Input
                    value={selectedItem?.status || ""}
                    readOnly
                    className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Date</Label>
                  <Input
                    value={selectedItem?.date || ""}
                    readOnly
                    className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Due Date</Label>
                  <Input
                    value={selectedItem?.dueDate || ""}
                    readOnly
                    className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsViewDetailsOpen(false)}
              className="rounded-xl border-roseLight-DEFAULT hover:bg-roseLight-DEFAULT/30"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Quantity Modal */}
      <Dialog open={isUpdateQuantityOpen} onOpenChange={setIsUpdateQuantityOpen}>
        <DialogContent className="sm:max-w-md mx-4 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Update Quantity</DialogTitle>
            <DialogDescription className="text-gray-600">
              Update the quantity for {selectedInventoryItem?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="newQuantity" className="text-gray-700 font-medium">
                New Quantity
              </Label>
              <Input
                id="newQuantity"
                type="number"
                placeholder="Enter new quantity"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                className="mt-1 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsUpdateQuantityOpen(false)
                setNewQuantity("")
              }}
              className="rounded-xl border-roseLight-DEFAULT hover:bg-roseLight-DEFAULT/30"
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-roseDark-DEFAULT to-roseMedium-DEFAULT hover:from-roseDeep-DEFAULT hover:to-roseDark-DEFAULT text-white rounded-xl"
              onClick={handleQuantityUpdate}
            >
              Update Quantity
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md mx-4 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Confirm Delete</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete {deleteItem?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="rounded-xl border-roseLight-DEFAULT hover:bg-roseLight-DEFAULT/30"
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-danger-DEFAULT to-danger-light hover:from-roseDeep-DEFAULT hover:to-danger-DEFAULT text-white rounded-xl bg-rose-700"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Order Modal */}
      <Dialog open={isManageOrderOpen} onOpenChange={setIsManageOrderOpen}>
        <DialogContent className="sm:max-w-lg mx-4 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Manage Service Order</DialogTitle>
            <DialogDescription className="text-gray-600">
              Drag and drop to reorder services for {selectedCategory === "all" ? "all categories" : selectedCategory}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 max-h-96 overflow-y-auto">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="services">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {reorderingServices.map((service, index) => (
                      <Draggable key={service.id} draggableId={service.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white border border-roseLight-DEFAULT transition-all duration-200 rounded-xl ${
                              snapshot.isDragging
                                ? "shadow-lg scale-105 rotate-2 bg-gradient-to-r from-roseBackground-DEFAULT to-roseLight-DEFAULT"
                                : "hover:shadow-md cursor-grab active:cursor-grabbing"
                            }`}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-roseLight-DEFAULT rounded-lg flex items-center justify-center text-roseDeep-DEFAULT font-bold text-sm">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-800">{service.name}</h4>
                                    <p className="text-sm text-gray-600">
                                      {service.category} • ${service.price}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-400">
                                  <div className="flex flex-col space-y-1">
                                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                  </div>
                                  <div className="flex flex-col space-y-1">
                                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsManageOrderOpen(false)
                setReorderingServices([])
              }}
              className="rounded-xl border-roseLight-DEFAULT hover:bg-roseLight-DEFAULT/30"
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-roseDark-DEFAULT to-roseMedium-DEFAULT hover:from-roseDeep-DEFAULT hover:to-roseDark-DEFAULT text-white rounded-xl"
              onClick={handleSaveOrder}
            >
              Save Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
