"use client"

import { useState,useMemo } from "react"
import { LogOut, Home, Calendar, Users, BarChart3} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
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
import { CalendarPageContent } from "./dashboard/calendar-page-content"
import { InventoryPageContent } from "./dashboard/inventory-page-content"
import { InvoicesPageContent } from "./dashboard/invoices-page-content"
import { ReportsPageContent } from "./dashboard/reports-page-content"

// Update imports for the new sidebar structure
// 1. Remove `import { SidebarContent } from "./dashboard/sidebar-content"`
// 2. Add `import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"`
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
// 3. Add `import { AppSidebar } from "./app-sidebar"`
import { AppSidebar } from "./app-sidebar"

import { UserCheck, Scissors, Package, FileText } from "lucide-react"

const bottomNavItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "clients", label: "Clients", icon: Users },
  { id: "staff", label: "Staff", icon: UserCheck },
  { id: "services", label: "Services", icon: Scissors },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "logout", label: "Logout", icon: LogOut },
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
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  // Item states
  const [deleteItem, setDeleteItem] = useState<{ type: string; id: string; name: string } | null>(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  // Form states
  const { toast } = useToast()

  const [selectedCategory, setSelectedCategory] = useState("all")

  const handleLogout = () => {
    setShowLogoutConfirm(false)
    onLogout()
  }

  const [initialAction, setInitialAction] = useState<string | null>(null)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setIsMobileMenuOpen(false)
  }

  const handleQuickAction = (tab: string, action: string) => {
    setActiveTab(tab)
    setInitialAction(action)
  }

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter((client) => client.id !== id))
    toast({
      title: "Success",
      description: "Client deleted successfully",
    })
  }

  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter((member) => member.id !== id))
    toast({
      title: "Success",
      description: "Staff member deleted successfully",
    })
  }

  const handleDeleteService = (id: string) => {
    setServices(services.filter((service) => service.id !== id))
    toast({
      title: "Success",
      description: "Service deleted successfully",
    })
  }

  const handleUpdateBookingStatus = (id:string, status: Booking["status"]) => {
    setBookings(bookings.map((booking) => (booking.id === id ? { ...booking, status } : booking)))
    toast({
      title: "Success",
      description: `Booking status updated to ${status}`,
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
            handleQuickAction={handleQuickAction}
            setSelectedItem={setSelectedItem}
            setIsViewDetailsOpen={setIsViewDetailsOpen}
          />
        )
      case "clients":
        return (
          <ClientPageContent
            clients={clients}
            setClients={setClients}
            initialAction={initialAction}
            setInitialAction={setInitialAction}
            setSelectedItem={setSelectedItem}
            setIsViewDetailsOpen={setIsViewDetailsOpen}
            openDeleteConfirm={openDeleteConfirm}
          />
        )
      case "staff":
        return (
          <StaffPageContent
            staff={staff}
            setStaff={setStaff}
            initialAction={initialAction}
            setInitialAction={setInitialAction}
            setSelectedItem={setSelectedItem}
            setIsViewDetailsOpen={setIsViewDetailsOpen}
            openDeleteConfirm={openDeleteConfirm}
          />
        )
      case "services":
        return (
          <ServicesPageContent
            services={services}
            setServices={setServices}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            openDeleteConfirm={openDeleteConfirm}
            initialAction={initialAction}
            setInitialAction={setInitialAction}
          />
        )
      case "bookings":
        return (
          <BookingsPageContent
            bookings={bookings}
            setBookings={setBookings}
            clients={clients}
            services={services}
            staff={staff}
            setSelectedItem={setSelectedItem}
            setIsViewDetailsOpen={setIsViewDetailsOpen}
            handleUpdateBookingStatus={handleUpdateBookingStatus}
            initialAction={initialAction}
            setInitialAction={setInitialAction}
          />
        )
      case "calendar":
        return (
          <CalendarPageContent
            bookings={bookings}
            setSelectedItem={setSelectedItem}
            setIsViewDetailsOpen={setIsViewDetailsOpen}
            handleUpdateBookingStatus={handleUpdateBookingStatus}
            setBookings={setBookings}
          />
        )
      case "inventory":
        return (
          <InventoryPageContent
            inventory={inventory}
            setInventory={setInventory}
            openDeleteConfirm={openDeleteConfirm}
          />
        )
      case "invoices":
        return (
          <InvoicesPageContent
            invoices={invoices}
            setInvoices={setInvoices}
            bookings={bookings}
            setSelectedItem={setSelectedItem}
            setIsViewDetailsOpen={setIsViewDetailsOpen}
            handleUpdateInvoiceStatus={handleUpdateInvoiceStatus}
            initialAction={initialAction}
            setInitialAction={setInitialAction}
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
            handleQuickAction={handleQuickAction}
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
        <main className="flex-1 overflow-auto p-4 sm:p-6 pb-24 lg:pb-6">{renderContent()}</main>
        {/* Mobile Bottom Navigation - Keep this as it's a separate navigation */}
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-background/90 backdrop-blur-xl border-t border-border px-2 py-2 shadow-lg z-50">
          <div className="flex w-full justify-between items-center gap-1">
            {bottomNavItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "logout") {
                      setShowLogoutConfirm(true)
                    } else {
                      handleTabChange(item.id)
                    }
                  }}
                  className={`flex-1 min-w-0 flex flex-col items-center justify-center space-y-1 p-2 rounded-md transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className={`h-6 w-6 ${activeTab === item.id ? "text-primary-foreground" : "text-foreground"}`}strokeWidth={2}/>
                  {/* <span className="text-xs font-medium">{item.label}</span> */}
                </button>
              )
            })}
          </div>
        </div>
      </SidebarInset>

      {/* All Modals */}
      {/* Logout Confirmation Modal */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You will need to sign in again to access the dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowLogoutConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" strokeWidth={2} />
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Details</DialogTitle>
            <DialogDescription>
              Details for {selectedItem?.name || selectedItem?.clientName || selectedItem?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {activeTab === "clients" && (
              <>
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={selectedItem?.name || ""}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={selectedItem?.email || ""}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={selectedItem?.phone || ""}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={selectedItem?.notes || ""}
                    readOnly
                  />
                </div>
              </>
            )}

            {activeTab === "staff" && (
              <>
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={selectedItem?.name || ""}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={selectedItem?.email || ""}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Specialty</Label>
                  <Input
                    value={selectedItem?.specialty || ""}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Availability</Label>
                  <Input
                    value={selectedItem?.availability || ""}
                    readOnly
                  />
                </div>
              </>
            )}

            {activeTab === "bookings" && (
              <>
                <div>
                  <Label>Client Name</Label>
                  <Input
                    value={selectedItem?.clientName || ""}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Service Name</Label>
                  <Input
                    value={selectedItem?.serviceName || ""}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Staff Name</Label>
                  <Input
                    value={selectedItem?.staffName || ""}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    value={selectedItem?.date || ""}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input
                    value={selectedItem?.time || ""}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Input
                    value={selectedItem?.status || ""}
                    readOnly
                  />
                </div>
              </>
            )}

            {activeTab === "invoices" && (
              <>
                <div>
                  <Label>Invoice ID</Label>
                  <Input
                    value={selectedItem?.id || ""}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Client Name</Label>
                  <Input
                    value={selectedItem?.clientName || ""}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Total</Label>
                  <Input
                    value={selectedItem?.total || ""}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Input
                    value={selectedItem?.status || ""}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    value={selectedItem?.date || ""}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input
                    value={selectedItem?.dueDate || ""}
                    readOnly
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsViewDetailsOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteItem?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </SidebarProvider>
  )
}
