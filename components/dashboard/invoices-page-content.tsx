"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Plus, Edit, Trash2, Search } from "lucide-react"
import type { Invoice, InvoiceItem } from "@/types"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { mockClients, mockServices, mockInventory } from "@/data/mockData"

interface InvoicesPageContentProps {
  invoices: Invoice[]
  setIsCreateInvoiceOpen: (isOpen: boolean) => void
  setSelectedItem: (item: any) => void
  setIsViewDetailsOpen: (isOpen: boolean) => void
  handleUpdateInvoiceStatus: (id: string, status: Invoice["status"]) => void
  setInvoices: (invoices: Invoice[]) => void
}

export function InvoicesPageContent({
  invoices,
  setIsCreateInvoiceOpen,
  setSelectedItem,
  setIsViewDetailsOpen,
  handleUpdateInvoiceStatus,
  setInvoices,
}: InvoicesPageContentProps) {
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState("all")
  const [isAddInvoiceDialogOpen, setIsAddInvoiceDialogOpen] = useState(false)
  const [isEditInvoiceDialogOpen, setIsEditInvoiceDialogOpen] = useState(false)
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null)
  const [newInvoice, setNewInvoice] = useState<Omit<Invoice, "id">>({
    clientId: "",
    clientName: "",
    date: "",
    totalAmount: 0,
    status: "Pending",
    items: [],
  })
  const [newItem, setNewItem] = useState<InvoiceItem>({
    type: "service",
    id: "",
    name: "",
    price: 0,
    quantity: 1,
  })
  const [searchTerm, setSearchTerm] = useState("")

  const handleAddItem = () => {
    if (newItem.id && newItem.name && newItem.price > 0) {
      setNewInvoice((prev) => ({
        ...prev,
        items: [...prev.items, newItem],
        totalAmount: prev.totalAmount + newItem.price * newItem.quantity,
      }))
      setNewItem({ type: "service", id: "", name: "", price: 0, quantity: 1 })
    }
  }

  const handleRemoveItem = (index: number) => {
    setNewInvoice((prev) => {
      const updatedItems = prev.items.filter((_, i) => i !== index)
      const updatedTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      return { ...prev, items: updatedItems, totalAmount: updatedTotal }
    })
  }

  const handleAddInvoice = () => {
    const id = (invoices.length + 1).toString()
    const client = mockClients.find((c) => c.id === newInvoice.clientId)

    setInvoices([
      ...invoices,
      {
        id,
        ...newInvoice,
        clientName: client?.name || "",
      },
    ])
    setNewInvoice({
      clientId: "",
      clientName: "",
      date: "",
      totalAmount: 0,
      status: "Pending",
      items: [],
    })
    setIsAddInvoiceDialogOpen(false)
  }

  const handleEditInvoice = () => {
    if (currentInvoice) {
      const client = mockClients.find((c) => c.id === currentInvoice.clientId)
      setInvoices(
        invoices.map((invoice) =>
          invoice.id === currentInvoice.id
            ? {
                ...currentInvoice,
                clientName: client?.name || "",
              }
            : invoice,
        ),
      )
      setCurrentInvoice(null)
      setIsEditInvoiceDialogOpen(false)
    }
  }

  const handleDeleteInvoice = (id: string) => {
    setInvoices(invoices.filter((invoice) => invoice.id !== id))
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Invoice Management</h2>
          <p className="text-gray-600">Track payments and billing</p>
        </div>
        <Button
          className="bg-gradient-to-r from-roseDark-DEFAULT to-roseMedium-DEFAULT hover:from-roseDeep-DEFAULT hover:to-roseDark-DEFAULT text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
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

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <CardTitle className="flex items-center space-x-2 text-roseDark-DEFAULT">
              <FileText className="w-5 h-5 text-roseDark-DEFAULT" strokeWidth={2} />
              <span>All Invoices ({searchFilteredInvoices.length})</span>
            </CardTitle>
            <Select value={invoiceStatusFilter} onValueChange={setInvoiceStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 rounded-xl border-roseLight-DEFAULT bg-white/50 backdrop-blur-sm">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
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
                        <Button variant="outline" size="icon" onClick={() => handleDeleteInvoice(invoice.id)}>
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

      {/* Add Invoice Dialog */}
      <Dialog open={isAddInvoiceDialogOpen} onOpenChange={setIsAddInvoiceDialogOpen}>
        <DialogContent className="sm:max-w-[400px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select
                onValueChange={(value) => setNewInvoice({ ...newInvoice, clientId: value })}
                value={newInvoice.clientId}
              >
                <SelectTrigger className="w-full rounded-xl border-pale-blush focus:border-dusty-rose focus:ring-dusty-rose bg-white/50 backdrop-blur-sm">
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
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newInvoice.date}
                onChange={(e) => setNewInvoice({ ...newInvoice, date: e.target.value })}
                className="w-full rounded-xl border-pale-blush focus:border-dusty-rose focus:ring-dusty-rose bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value) => setNewInvoice({ ...newInvoice, status: value as Invoice["status"] })}
                value={newInvoice.status}
              >
                <SelectTrigger className="w-full rounded-xl border-pale-blush focus:border-dusty-rose focus:ring-dusty-rose bg-white/50 backdrop-blur-sm">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <h3 className="text-lg font-semibold mt-4">Items</h3>
            <div className="space-y-3">
              {newInvoice.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 border rounded-lg border-pale-blush/50 bg-pale-blush/10"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.type === "service" ? "Service" : "Product"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="item-type">Add Item</Label>
              <div className="flex gap-2">
                <Select
                  onValueChange={(value) =>
                    setNewItem({ ...newItem, type: value as InvoiceItem["type"], id: "", name: "", price: 0 })
                  }
                  value={newItem.type}
                >
                  <SelectTrigger className="flex-1 rounded-xl border-pale-blush focus:border-dusty-rose focus:ring-dusty-rose bg-white/50 backdrop-blur-sm">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={(value) => {
                    const selectedItem =
                      newItem.type === "service"
                        ? mockServices.find((s) => s.id === value)
                        : mockInventory.find((p) => p.id === value)
                    setNewItem({
                      ...newItem,
                      id: value,
                      name: selectedItem?.name || "",
                      price: selectedItem?.price || 0,
                    })
                  }}
                  value={newItem.id}
                >
                  <SelectTrigger className="flex-2 rounded-xl border-pale-blush focus:border-dusty-rose focus:ring-dusty-rose bg-white/50 backdrop-blur-sm">
                    <SelectValue placeholder={`Select ${newItem.type}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {newItem.type === "service"
                      ? mockServices.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} (${service.price.toFixed(2)})
                          </SelectItem>
                        ))
                      : mockInventory.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} (${product.price.toFixed(2)})
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-quantity">Quantity</Label>
              <Input
                id="item-quantity"
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: Number.parseInt(e.target.value) })}
                className="w-full rounded-xl border-pale-blush focus:border-dusty-rose focus:ring-dusty-rose bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                className="border-pale-blush hover:bg-pale-blush/30 bg-transparent"
                onClick={handleAddItem}
              >
                Add Item
              </Button>
            </div>

            <div className="text-right text-xl font-bold mt-4">Total: ${newInvoice.totalAmount.toFixed(2)}</div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddInvoice}
              className="bg-roseDark hover:bg-roseMedium text-roseBackground-foreground"
            >
              Create Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Invoice Dialog */}
      <Dialog open={isEditInvoiceDialogOpen} onOpenChange={setIsEditInvoiceDialogOpen}>
        <DialogContent className="sm:max-w-[400px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-client">Client</Label>
              <Select
                onValueChange={(value) =>
                  setCurrentInvoice(currentInvoice ? { ...currentInvoice, clientId: value } : null)
                }
                value={currentInvoice?.clientId || ""}
              >
                <SelectTrigger className="w-full rounded-xl border-pale-blush focus:border-dusty-rose focus:ring-dusty-rose bg-white/50 backdrop-blur-sm">
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
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={currentInvoice?.date || ""}
                onChange={(e) => setCurrentInvoice(currentInvoice ? { ...currentInvoice, date: e.target.value } : null)}
                className="w-full rounded-xl border-pale-blush focus:border-dusty-rose focus:ring-dusty-rose bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                onValueChange={(value) =>
                  setCurrentInvoice(currentInvoice ? { ...currentInvoice, status: value as Invoice["status"] } : null)
                }
                value={currentInvoice?.status || ""}
              >
                <SelectTrigger className="w-full rounded-xl border-pale-blush focus:border-dusty-rose focus:ring-dusty-rose bg-white/50 backdrop-blur-sm">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <h3 className="text-lg font-semibold mt-4">Items</h3>
            <div className="space-y-3">
              {currentInvoice?.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 border rounded-lg border-pale-blush/50 bg-pale-blush/10"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.type === "service" ? "Service" : "Product"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (currentInvoice) {
                          const updatedItems = currentInvoice.items.filter((_, i) => i !== index)
                          const updatedTotal = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
                          setCurrentInvoice({
                            ...currentInvoice,
                            items: updatedItems,
                            totalAmount: updatedTotal,
                          })
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="edit-item-type">Add Item</Label>
              <div className="flex gap-2">
                <Select
                  onValueChange={(value) =>
                    setNewItem({ ...newItem, type: value as InvoiceItem["type"], id: "", name: "", price: 0 })
                  }
                  value={newItem.type}
                >
                  <SelectTrigger className="flex-1 rounded-xl border-pale-blush focus:border-dusty-rose focus:ring-dusty-rose bg-white/50 backdrop-blur-sm">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={(value) => {
                    const selectedItem =
                      newItem.type === "service"
                        ? mockServices.find((s) => s.id === value)
                        : mockInventory.find((p) => p.id === value)
                    setNewItem({
                      ...newItem,
                      id: value,
                      name: selectedItem?.name || "",
                      price: selectedItem?.price || 0,
                    })
                  }}
                  value={newItem.id}
                >
                  <SelectTrigger className="flex-2 rounded-xl border-pale-blush focus:border-dusty-rose focus:ring-dusty-rose bg-white/50 backdrop-blur-sm">
                    <SelectValue placeholder={`Select ${newItem.type}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {newItem.type === "service"
                      ? mockServices.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} (${service.price.toFixed(2)})
                          </SelectItem>
                        ))
                      : mockInventory.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} (${product.price.toFixed(2)})
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-item-quantity">Quantity</Label>
              <Input
                id="edit-item-quantity"
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: Number.parseInt(e.target.value) })}
                className="w-full rounded-xl border-pale-blush focus:border-dusty-rose focus:ring-dusty-rose bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                className="border-pale-blush hover:bg-pale-blush/30 bg-transparent"
                onClick={() => {
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
                }}
              >
                Add Item
              </Button>
            </div>

            <div className="text-right text-xl font-bold mt-4">
              Total: ${currentInvoice?.totalAmount.toFixed(2) || "0.00"}
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleEditInvoice}
              className="bg-roseDark hover:bg-roseMedium text-roseBackground-foreground"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
