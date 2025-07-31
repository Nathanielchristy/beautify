"use client"

import { Input } from "@/components/ui/input"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Package, Search, Trash2 } from "lucide-react"
import type { InventoryItem, Product } from "@/types"
import { mockInventory } from "@/data/mockData"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface InventoryPageContentProps {
  inventory: InventoryItem[]
  setIsAddInventoryOpen: (isOpen: boolean) => void
  openUpdateQuantityModal: (item: InventoryItem) => void
  handleUpdateInventoryQuantity: (id: string, newQuantity: number) => void
}

export function InventoryPageContent({
  inventory: initialInventory,
  setIsAddInventoryOpen,
  openUpdateQuantityModal,
  handleUpdateInventoryQuantity,
}: InventoryPageContentProps) {
  const [inventory, setInventory] = useState<Product[]>(mockInventory)
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false)
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    quantity: 0,
    price: 0,
    supplier: "",
    category: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState("all")

  const handleAddProduct = () => {
    const id = (inventory.length + 1).toString()
    setInventory([...inventory, { id, ...newProduct }])
    setNewProduct({ name: "", description: "", quantity: 0, price: 0, supplier: "", category: "" })
    setIsAddProductDialogOpen(false)
  }

  const handleEditProduct = () => {
    if (currentProduct) {
      setInventory(inventory.map((product) => (product.id === currentProduct.id ? currentProduct : product)))
      setCurrentProduct(null)
      setIsEditProductDialogOpen(false)
    }
  }

  const handleDeleteProduct = () => {
    if (productToDelete) {
      setInventory(inventory.filter((product) => product.id !== productToDelete))
      setProductToDelete(null)
    }
    setIsDeleteDialogOpen(false)
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
          className="bg-gradient-to-r from-[#f5d76e] to-[#d4af37] hover:from-[#e6c14c] hover:to-[#bfa235] text-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-200
"
          onClick={() => setIsAddProductDialogOpen(true)}
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

      <Card className="bg-black/50 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
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
                            setCurrentProduct(product)
                            setIsEditProductDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setProductToDelete(product.id)
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md mx-4 bg-black/90 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Confirm Delete</DialogTitle>
            <p className="text-white">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
          </DialogHeader>
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setProductToDelete(null)
              }}
              className="rounded-xl hover:bg-roseLight-DEFAULT/30"
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-danger-DEFAULT to-danger-light hover:from-roseDeep-DEFAULT hover:to-danger-DEFAULT text-black rounded-xl bg-[#FFD700]"
              onClick={handleDeleteProduct}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-black/90">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: Number.parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: Number.parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier" className="text-right">
                Supplier
              </Label>
              <Input
                id="supplier"
                value={newProduct.supplier}
                onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                id="category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddProduct}
              className="bg-[#FFD700] text-black"
            >
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditProductDialogOpen} onOpenChange={setIsEditProductDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={currentProduct?.name || ""}
                onChange={(e) => setCurrentProduct(currentProduct ? { ...currentProduct, name: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Input
                id="edit-description"
                value={currentProduct?.description || ""}
                onChange={(e) =>
                  setCurrentProduct(currentProduct ? { ...currentProduct, description: e.target.value } : null)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="edit-quantity"
                type="number"
                value={currentProduct?.quantity || 0}
                onChange={(e) =>
                  setCurrentProduct(
                    currentProduct ? { ...currentProduct, quantity: Number.parseInt(e.target.value) } : null,
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">
                Price
              </Label>
              <Input
                id="edit-price"
                type="number"
                value={currentProduct?.price || 0}
                onChange={(e) =>
                  setCurrentProduct(
                    currentProduct ? { ...currentProduct, price: Number.parseFloat(e.target.value) } : null,
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-supplier" className="text-right">
                Supplier
              </Label>
              <Input
                id="edit-supplier"
                value={currentProduct?.supplier || ""}
                onChange={(e) =>
                  setCurrentProduct(currentProduct ? { ...currentProduct, supplier: e.target.value } : null)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                Category
              </Label>
              <Input
                id="edit-category"
                value={currentProduct?.category || ""}
                onChange={(e) =>
                  setCurrentProduct(currentProduct ? { ...currentProduct, category: e.target.value } : null)
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleEditProduct}
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
