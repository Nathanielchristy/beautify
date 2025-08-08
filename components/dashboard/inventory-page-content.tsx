"use client"

import { Input } from "@/components/ui/input"

import { useState, useMemo, type Dispatch, type SetStateAction } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Package, Search, Trash2 } from "lucide-react"
import type { InventoryItem } from "@/types"
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface InventoryPageContentProps {
  inventory: InventoryItem[]
  setInventory: Dispatch<SetStateAction<InventoryItem[]>>
  openDeleteConfirm: (type: string, id: string, name: string) => void
}

export function InventoryPageContent({
  inventory,
  setInventory,
  openDeleteConfirm,
}: InventoryPageContentProps) {
  const [isAddInventoryOpen, setIsAddInventoryOpen] = useState(false)
  const [isUpdateQuantityOpen, setIsUpdateQuantityOpen] = useState(false)
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null)
  const [newInventoryItem, setNewInventoryItem] = useState<Partial<InventoryItem>>({})
  const [newQuantity, setNewQuantity] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState("all")
  const { toast } = useToast()

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9)

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

  const filteredInventory = useMemo(() => {
    return inventory.filter((product) => {
      if (inventoryStatusFilter !== "all" && product.status !== inventoryStatusFilter) {
        return false
      }
      return (
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
  }, [inventory, inventoryStatusFilter, searchTerm])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Inventory Management</h2>
          <p className="text-gray-600">Track your stock and supplies</p>
        </div>
        <Button
          className="bg-gradient-to-r from-white to-[#f9f9f9] hover:from-[#f0f0f0] hover:to-[#e6e6e6] text-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={() => setIsAddInventoryOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
          Add Item
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      <Card className="bg-black/95 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <CardTitle className="flex items-center space-x-2 text-roseDark-DEFAULT">
              <Package className="w-5 h-5 text-roseDark-DEFAULT" strokeWidth={2} />
              <span>Stock Overview ({filteredInventory.length})</span>
            </CardTitle>
            <Select value={inventoryStatusFilter} onValueChange={setInventoryStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 rounded-xl border-roseLight-DEFAULT bg-white/50 backdrop-blur-sm">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                <SelectItem value="reorder">Reorder</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.supplier}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            openUpdateQuantityModal(product)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            openDeleteConfirm("inventory", product.id, product.name)
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

      {/* Add Inventory Item Modal */}
      <Dialog open={isAddInventoryOpen} onOpenChange={setIsAddInventoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
            <DialogDescription>Add a new product to inventory.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="inventoryName">
                Product Name *
              </Label>
              <Input
                id="inventoryName"
                placeholder="Enter product name"
                value={newInventoryItem.name || ""}
                onChange={(e) => setNewInventoryItem({ ...newInventoryItem, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="inventoryCategory">
                Category *
              </Label>
              <Select onValueChange={(value) => setNewInventoryItem({ ...newInventoryItem, category: value })}>
                <SelectTrigger>
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
              <Label htmlFor="inventorySupplier">
                Supplier *
              </Label>
              <Input
                id="inventorySupplier"
                placeholder="Enter supplier name"
                value={newInventoryItem.supplier || ""}
                onChange={(e) => setNewInventoryItem({ ...newInventoryItem, supplier: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inventoryQuantity">
                  Initial Quantity
                </Label>
                <Input
                  id="inventoryQuantity"
                  type="number"
                  placeholder="0"
                  value={newInventoryItem.quantity || ""}
                  onChange={(e) => setNewInventoryItem({ ...newInventoryItem, quantity: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="inventoryReorder">
                  Reorder Level
                </Label>
                <Input
                  id="inventoryReorder"
                  type="number"
                  placeholder="5"
                  value={newInventoryItem.reorderLevel || ""}
                  onChange={(e) => setNewInventoryItem({ ...newInventoryItem, reorderLevel: Number(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="inventoryPrice">
                Unit Price
              </Label>
              <Input
                id="inventoryPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newInventoryItem.unitPrice || ""}
                onChange={(e) => setNewInventoryItem({ ...newInventoryItem, unitPrice: Number(e.target.value) })}
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddInventoryOpen(false)
                  setNewInventoryItem({})
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddInventoryItem}
              >
                Add Item
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Quantity Modal */}
      <Dialog open={isUpdateQuantityOpen} onOpenChange={setIsUpdateQuantityOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Quantity</DialogTitle>
            <DialogDescription>
              Update the quantity for {selectedInventoryItem?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="newQuantity">
                New Quantity
              </Label>
              <Input
                id="newQuantity"
                type="number"
                placeholder="Enter new quantity"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
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
            >
              Cancel
            </Button>
            <Button
              onClick={handleQuantityUpdate}
            >
              Update Quantity
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
