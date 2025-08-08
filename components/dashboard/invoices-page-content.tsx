"use client"

import { useState, useMemo, useEffect, type Dispatch, type SetStateAction } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Plus, Edit, Trash2, Search } from "lucide-react"
import type { Invoice, InvoiceItem, Booking } from "@/types"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface InvoicesPageContentProps {
  invoices: Invoice[]
  setInvoices: Dispatch<SetStateAction<Invoice[]>>
  bookings: Booking[]
  initialAction: string | null
  setInitialAction: (action: string | null) => void
  setSelectedItem: (item: any) => void
  setIsViewDetailsOpen: (isOpen: boolean) => void
  handleUpdateInvoiceStatus: (id: string, status: Invoice["status"]) => void
}

export function InvoicesPageContent({
  invoices,
  setInvoices,
  bookings,
  initialAction,
  setInitialAction,
  setSelectedItem,
  setIsViewDetailsOpen,
  handleUpdateInvoiceStatus,
}: InvoicesPageContentProps) {
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState("all")
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false)
  const [isEditInvoiceDialogOpen, setIsEditInvoiceDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null)
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (initialAction === "add") {
      setIsCreateInvoiceOpen(true)
      setInitialAction(null)
    }
  }, [initialAction, setInitialAction])

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

  const handleEditInvoice = () => {
    if (currentInvoice) {
      // This is a placeholder, the original component had mock data logic
      // I'll keep it simple for now
      setInvoices(
        invoices.map((invoice) =>
          invoice.id === currentInvoice.id
            ? currentInvoice
            : invoice,
        ),
      )
      setCurrentInvoice(null)
      setIsEditInvoiceDialogOpen(false)
    }
  }

  const handleDeleteInvoice = () => {
    if (invoiceToDelete) {
      setInvoices(invoices.filter((invoice) => invoice.id !== invoiceToDelete))
      setInvoiceToDelete(null)
    }
    setIsDeleteDialogOpen(false)
  }

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      if (invoiceStatusFilter !== "all" && invoice.status !== invoiceStatusFilter) {
        return false
      }
      return true
    })
  }, [invoices, invoiceStatusFilter])

  const searchFilteredInvoices = useMemo(() => {
    return filteredInvoices.filter(
      (invoice) =>
        invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.status.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [filteredInvoices, searchTerm])

  // Function to add item to current invoice (for editing)
  const handleAddItemToCurrentInvoice = () => {
    if (currentInvoice && newItem.id && newItem.name && newItem.price > 0) {
      const updatedItems = [...currentInvoice.items, newItem]
      const updatedTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      setCurrentInvoice({
        ...currentInvoice,
        items: updatedItems,
        totalAmount: updatedTotal,
      })
      setNewItem({ type: "service", id: "", name: "", price: 0, quantity: 1 })
    }
  }

  // Function to remove item from current invoice (for editing)
  const handleRemoveItemFromCurrentInvoice = (index: number) => {
    if (currentInvoice) {
      const updatedItems = currentInvoice.items.filter((_, i) => i !== index)
      const updatedTotal = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
      setCurrentInvoice({
        ...currentInvoice,
        items: updatedItems,
        totalAmount: updatedTotal,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Invoice Management</h2>
          <p className="text-white">Track payments and billing</p>
        </div>
        <Button
          className="bg-gradient-to-r from-white to-[#f9f9f9] hover:from-[#f0f0f0] hover:to-[#e6e6e6] text-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={() => setIsCreateInvoiceOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
          Create Invoice
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      <Card className="bg-black/95 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <CardTitle className="flex items-center space-x-2 text-roseDark-DEFAULT">
              <FileText className="w-5 h-5 text-roseDark-DEFAULT" strokeWidth={2} />
              <span>All Invoices ({searchFilteredInvoices.length})</span>
            </CardTitle>
            <Select value={invoiceStatusFilter} onValueChange={setInvoiceStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 rounded-xl border-roseLight-DEFAULT bg-black/95 backdrop-blur-sm">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchFilteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.clientName}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>${invoice.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>{invoice.status}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setCurrentInvoice(invoice)
                            setIsEditInvoiceDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setInvoiceToDelete(invoice.id)
                            setIsDeleteDialogOpen(true)
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
        </CardContent>
      </Card>

      {/* Create Invoice Modal */}
      <Dialog open={isCreateInvoiceOpen} onOpenChange={setIsCreateInvoiceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogDescription>Generate invoice from completed bookings.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateInvoiceOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateInvoice}
            >
              Create Invoice
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}