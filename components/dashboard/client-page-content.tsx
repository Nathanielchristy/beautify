"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Phone, Calendar, Eye, Trash2, Plus, Users, Edit } from "lucide-react"
import type { Client } from "@/types"
import { useDebounce } from "@/hooks/use-debounce" // Assuming this hook exists or will be created
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Dispatch, SetStateAction } from "react"

interface ClientPageContentProps {
  clients: Client[]
  isAddClientOpen: boolean
  setIsAddClientOpen: (isOpen: boolean) => void
  newClient: Partial<Client>
  setNewClient: Dispatch<SetStateAction<Partial<Client>>>
  handleAddClient: () => void
  setSelectedItem: (item: any) => void
  setIsViewDetailsOpen: (isOpen: boolean) => void
  openDeleteConfirm: (type: string, id: string, name: string) => void
}

export function ClientPageContent({
  clients: initialClients,
  isAddClientOpen,
  setIsAddClientOpen,
  newClient: newClientFromProps,
  setNewClient: setNewClientFromProps,
  handleAddClient: handleAddClientFromProps,
  setSelectedItem,
  setIsViewDetailsOpen,
  openDeleteConfirm,
}: ClientPageContentProps) {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false)
  const [isEditClientDialogOpen, setIsEditClientDialogOpen] = useState(false)
  const [currentClient, setCurrentClient] = useState<Client | null>(null)
  const [newClient, setNewClient] = useState<Omit<Client, "id">>({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    status:"active",
  })
  const [clientSearch, setClientSearch] = useState("")
  const debouncedClientSearch = useDebounce(clientSearch, 300)

  const handleAddClient = () => {
    const id = (clients.length + 1).toString()
    setClients([...clients, { id, ...newClient }])
    setNewClient({ name: "", email: "", phone: "", address: "", notes: "", status: "active" })
    setIsAddClientDialogOpen(false)
  }

  const handleEditClient = () => {
    if (currentClient) {
      setClients(clients.map((client) => (client.id === currentClient.id ? currentClient : client)))
      setCurrentClient(null)
      setIsEditClientDialogOpen(false)
    }
  }

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter((client) => client.id !== id))
  }

  const filteredClients = useMemo(() => {
    if (!debouncedClientSearch.trim()) return clients

    const searchTerm = debouncedClientSearch.toLowerCase().trim()

    return clients.filter((client) => {
      const searchableText = `${client.name} ${client.email} ${client.phone}`.toLowerCase()
      return searchableText.includes(searchTerm)
    })
  }, [clients, debouncedClientSearch])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Client Management</h2>
          <p className="text-white">Manage your client relationships</p>
        </div>
          <Button
            className="bg-gradient-to-r from-white to-[#f9f9f9] hover:from-[#f0f0f0] hover:to-[#e6e6e6] text-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => setIsAddClientOpen(true)}
          >
          <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
          Add New Client
        </Button>
      </div>

      <Card className="bg-black/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <CardTitle className="flex items-center space-x-2 text-roseDark-DEFAULT">
              <Users className="w-5 h-5 text-roseDark-DEFAULT" strokeWidth={2} />
              <span>All Clients ({filteredClients.length})</span>
            </CardTitle>
            <div className="flex space-x-2">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
                  strokeWidth={2}
                />
                <Input
                  placeholder="Search clients..."
                  className="w-full sm:w-80 pl-10 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-black/50 backdrop-blur-sm"
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-roseLight-DEFAULT bg-transparent hover:bg-roseLight-DEFAULT/30"
              >
                <Filter className="h-4 w-4" strokeWidth={2} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-4">
            {filteredClients.map((client) => (
              <Card
                key={client.id}
                className="bg-black/50 border-0 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={client.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-roseLight-DEFAULT text-roseDeep-DEFAULT">
                          {client.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-white">{client.name}</h3>
                        <p className="text-sm text-white">{client.email}</p>
                      </div>
                    </div>
                    <Badge
                      className={
                        client.status === "active"
                          ? "bg-success-light text-success-DEFAULT"
                          : "bg-[#FFD700] text-white"
                      }
                    >
                      {client.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-white mb-3">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" strokeWidth={2} />
                      <span>{client.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" strokeWidth={2} />
                      <span>{client.lastVisit}</span>
                    </div>
                    <div>Services: {client.servicesCount}</div>
                    <div>Spent: ${client.totalSpent}</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl bg-transparent border-roseLight-DEFAULT hover:bg-roseLight-DEFAULT/30"
                      onClick={() => {
                        setSelectedItem(client)
                        setIsViewDetailsOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" strokeWidth={2} />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl text-danger-DEFAULT border-danger-light hover:bg-danger-light/30 bg-transparent"
                      onClick={() => openDeleteConfirm("client", client.id, client.name)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" strokeWidth={2} />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow> 
                  <TableHead >Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-gray-500/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={client.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-white text-black">
                            {client.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{client.name}</p>
                          <p className="text-sm text-white">{client.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">{client.phone}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          client.status === "active"
                            ? "bg-success-light text-white"
                            : "bg-[#dbdbd6] text-black"
                        }
                      >
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">{client.servicesCount}</TableCell>
                    <TableCell className="text-white">${client.totalSpent}</TableCell>
                    <TableCell className="text-white">{client.lastVisit}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-gold text-white hover:bg-[#ffd700]/10 transition-all"
                          onClick={() => {
                            setSelectedItem(client)
                            setIsViewDetailsOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" strokeWidth={2} />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-gold text-white hover:bg-[#ffde59]/10 transition-all"
                          onClick={() => {
                            setCurrentClient(client)
                            setIsEditClientDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" strokeWidth={2} />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-gold text-white hover:bg-[#ffd6d6]/10 transition-all"
                          onClick={() => openDeleteConfirm("client", client.id, client.name)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" strokeWidth={2} />
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

      {/* Add Client Dialog */}
      <Dialog open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                value={newClient.address}
                onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Input
                id="notes"
                value={newClient.notes}
                onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddClient}
              className="bg-roseDark hover:bg-roseMedium text-roseBackground-foreground"
            >
              Add Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={isEditClientDialogOpen} onOpenChange={setIsEditClientDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={currentClient?.name || ""}
                onChange={(e) => setCurrentClient(currentClient ? { ...currentClient, name: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={currentClient?.email || ""}
                onChange={(e) => setCurrentClient(currentClient ? { ...currentClient, email: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-phone" className="text-right">
                Phone
              </Label>
              <Input
                id="edit-phone"
                value={currentClient?.phone || ""}
                onChange={(e) => setCurrentClient(currentClient ? { ...currentClient, phone: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-address" className="text-right">
                Address
              </Label>
              <Input
                id="edit-address"
                value={currentClient?.address || ""}
                onChange={(e) => setCurrentClient(currentClient ? { ...currentClient, address: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-notes" className="text-right">
                Notes
              </Label>
              <Input
                id="edit-notes"
                value={currentClient?.notes || ""}
                onChange={(e) => setCurrentClient(currentClient ? { ...currentClient, notes: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleEditClient}
              className="bg-roseDark hover:bg-roseMedium text-roseBackground-foreground"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Client Modal */}
      <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Enter client information to add them to your system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="clientName">
                Full Name *
              </Label>
              <Input
                id="clientName"
                placeholder="Enter client name"
                value={newClientFromProps.name || ""}
                onChange={(e) => setNewClientFromProps({ ...newClientFromProps, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="clientEmail">
                Email *
              </Label>
              <Input
                id="clientEmail"
                type="email"
                placeholder="client@example.com"
                value={newClientFromProps.email || ""}
                onChange={(e) => setNewClientFromProps({ ...newClientFromProps, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="clientPhone">
                Phone Number *
              </Label>
              <Input
                id="clientPhone"
                placeholder="(555) 123-4567"
                value={newClientFromProps.phone || ""}
                onChange={(e) => setNewClientFromProps({ ...newClientFromProps, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="clientNotes">
                Notes
              </Label>
              <Textarea
                id="clientNotes"
                placeholder="Additional notes..."
                value={newClientFromProps.notes || ""}
                onChange={(e) => setNewClientFromProps({ ...newClientFromProps, notes: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddClientOpen(false)
                  setNewClientFromProps({})
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddClientFromProps}
              >
                Add Client
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
