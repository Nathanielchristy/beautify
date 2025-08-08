"use client"

import { useState, useMemo, useEffect, type Dispatch, type SetStateAction } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Filter, Plus, Edit, Eye, Settings, Trash2, MoreHorizontal } from "lucide-react"
import type { Service } from "@/types"
import { useDebounce } from "@/hooks/use-debounce"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"

interface ServicesPageContentProps {
  services: Service[]
  setServices: Dispatch<SetStateAction<Service[]>>
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  openDeleteConfirm: (type: string, id: string, name: string) => void
  initialAction: string | null
  setInitialAction: (action: string | null) => void
}

export function ServicesPageContent({
  services,
  setServices,
  selectedCategory,
  setSelectedCategory,
  openDeleteConfirm,
  initialAction,
  setInitialAction,
}: ServicesPageContentProps) {
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false)
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isManageOrderOpen, setIsManageOrderOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [newService, setNewService] = useState<Partial<Service>>({})
  const [newCategory, setNewCategory] = useState("")
  const [reorderingServices, setReorderingServices] = useState<Service[]>([])
  const [serviceSearch, setServiceSearch] = useState("")
  const debouncedServiceSearch = useDebounce(serviceSearch, 300)
  const { toast } = useToast()

  useEffect(() => {
    if (initialAction === "add") {
      setIsAddServiceOpen(true)
      setInitialAction(null)
    }
  }, [initialAction, setInitialAction])

    // Generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9)

  const serviceCategories = useMemo(() => {
    const categories = services.map((service) => service.category)
    return [...new Set(categories)]
  }, [services])

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
      color: "bg-primary text-primary-foreground", // Default color for new service
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

    // This is a bit of a hack, we should be updating the categories in a more robust way
    const newService = {
        id: generateId(),
        name: "New Service",
        category: newCategory,
        price: 0,
        duration: 0,
        description: "",
        isActive: false,
        icon: "✨",
        color: "bg-primary text-primary-foreground",
    }
    setServices([...services, newService])

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
    const reorderedIds = new Set(reorderingServices.map(s => s.id));
    const newServices: Service[] = [];
    let reorderedInserted = false;

    for (const service of services) {
      if (reorderedIds.has(service.id)) {
        if (!reorderedInserted) {
          newServices.push(...reorderingServices);
          reorderedInserted = true;
        }
      } else {
        newServices.push(service);
      }
    }

    setServices(newServices);
    setIsManageOrderOpen(false)
    setReorderingServices([])

    toast({
      title: "Success",
      description: "Service order updated successfully",
    })
  }

  const getServiceCountByCategory = (category: string) => {
    if (category === "all") return services.length
    return services.filter((service) => service.category === category).length
  }

  const servicesByCategory = useMemo(() => {
    const grouped: { [key: string]: Service[] } = {}
    serviceCategories.forEach((category) => {
      grouped[category] = services.filter((service) => service.category === category)
    })
    return grouped
  }, [services, serviceCategories])

  const filteredServices = useMemo(() => {
    let filtered = services

    if (selectedCategory !== "all") {
      filtered = filtered.filter((service) => service.category === selectedCategory)
    }

    if (debouncedServiceSearch.trim()) {
      const searchTerm = debouncedServiceSearch.toLowerCase().trim()
      filtered = filtered.filter((service) => {
        const searchableText = `${service.name} ${service.category} ${service.description || ""}`.toLowerCase()
        return searchableText.includes(searchTerm)
      })
    }
    return filtered
  }, [services, selectedCategory, debouncedServiceSearch])

  const handleManageOrder = () => {
    const servicesToReorder =
      selectedCategory === "all" ? services : services.filter((service) => service.category === selectedCategory)
    setReorderingServices([...servicesToReorder])
    setIsManageOrderOpen(true)
  }

  return (
    <div className="flex h-full">
      <div className="hidden sm:block w-80 bg-black/95 backdrop-blur-sm border-r border-roseLight-DEFAULT p-6 rounded-l-2xl shadow-lg">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                selectedCategory === "all"
                ? "bg-gradient-to-r from-[#FFD700] via-[#FFC300] to-[#FFB000] text-black shadow-xl"
                : "text-[#FFD700] hover:bg-[#FFD700]/20 hover:text-black"

              }`}
            >
              <span className="font-medium">All categories</span>
              <span className="text-sm">{getServiceCountByCategory("all")}</span>
            </button>

            {serviceCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-[#FFD700] via-[#FFC300] to-[#FFB000] text-black shadow-xl"
                    : "text-[#FFD700] hover:bg-[#FFD700]/20 hover:text-black"

                }`}
              >
                <span className="font-medium">{category}</span>
                <span className="text-sm">{getServiceCountByCategory(category)}</span>
              </button>
            ))}

            <button
              onClick={() => setIsAddCategoryOpen(true)}
              className="w-full flex items-center px-4 py-3 text-roseDark-DEFAULT hover:bg-roseLight-DEFAULT/30 rounded-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
              <span className="font-medium">Add category</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Service Menu</h2>
              <p className="text-gray-600">View and manage the services offered by your business</p>
            </div>
            <div className="flex space-x-2">
              <Button
 className="bg-gradient-to-r from-white to-[#f9f9f9] hover:from-[#f0f0f0] hover:to-[#e6e6e6] text-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => setIsAddServiceOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
                Add A New Service
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
                strokeWidth={2}
              />
              <Input
                placeholder="Search service name"
                className="pl-10 rounded-xl border-roseLight-DEFAULT focus:border-roseDark-DEFAULT focus:ring-roseDark-DEFAULT bg-black/95 backdrop-blur-sm"
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="rounded-xl border-roseLight-DEFAULT bg-transparent hover:bg-roseLight-DEFAULT/30"
            >
              <Filter className="h-4 w-4 mr-2" strokeWidth={2} />
              Filters
            </Button>
            <Button
              variant="outline"
              className="rounded-xl border-roseLight-DEFAULT bg-transparent hover:bg-roseLight-DEFAULT/30"
              onClick={handleManageOrder}
            >
              Manage order
            </Button>
          </div>

          <div className="space-y-8">
            {selectedCategory === "all" ? (
              Object.entries(servicesByCategory).map(
                ([category, categoryServices]) =>
                  categoryServices.length > 0 && (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-white">{category}</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-xl bg-transparent border-roseLight-DEFAULT hover:bg-roseLight-DEFAULT/30"
                            >
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem className="hover:bg-roseLight-DEFAULT/30">Edit Category</DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-roseLight-DEFAULT/30">Hide Category</DropdownMenuItem>
                            <DropdownMenuItem className="text-danger-DEFAULT hover:bg-danger-light/30">
                              Delete Category
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-3">
                        {categoryServices.map((service) => (
                          <Card
                            key={service.id}
                            className="bg-black/95 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-1 h-12 bg-black rounded-full"></div>
                                  <div>
                                    <h4 className="font-semibold text-white">{service.name}</h4>
                                    <p className="text-sm text-gray-600">{service.duration}min</p>
                                    {service.description && (
                                      <p className="text-xs text-gray-500 mt-1">{service.description}</p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                  <div className="text-right">
                                    <p className="font-bold text-lg text-white">${service.price}</p>
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="rounded-xl hover:bg-roseLight-DEFAULT/30"
                                      >
                                        <MoreHorizontal className="h-4 w-4" strokeWidth={2} />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setEditingService(service)
                                          setIsEditServiceOpen(true)
                                        }}
                                        className="hover:bg-roseLight-DEFAULT/30"
                                      >
                                        <Edit className="h-4 w-4 mr-2" strokeWidth={2} />
                                        Edit Service
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="hover:bg-roseLight-DEFAULT/30">
                                        <Eye className="h-4 w-4 mr-2" strokeWidth={2} />
                                        View Details
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="hover:bg-roseLight-DEFAULT/30">
                                        <Settings className="h-4 w-4 mr-2" strokeWidth={2} />
                                        Service Settings
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="text-danger-DEFAULT hover:bg-danger-light/30"
                                        onClick={() => openDeleteConfirm("service", service.id, service.name)}
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" strokeWidth={2} />
                                        Delete Service
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ),
              )
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">{selectedCategory}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl bg-transparent border-roseLight-DEFAULT hover:bg-roseLight-DEFAULT/30"
                      >
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem className="hover:bg-roseLight-DEFAULT/30">Edit Category</DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-roseLight-DEFAULT/30">Hide Category</DropdownMenuItem>
                      <DropdownMenuItem className="text-danger-DEFAULT hover:bg-danger-light/30">
                        Delete Category
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="rounded-lg border overflow-hidden bg-black/95">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredServices.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell className="font-medium">{service.name}</TableCell>
                          <TableCell>{service.category}</TableCell>
                          <TableCell>${service.price.toFixed(2)}</TableCell>
                          <TableCell>{service.duration}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setCurrentService(service)
                                  setIsEditServiceDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => handleDeleteService(service.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </div>

      {/* Add Service Modal */}
      <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>Create a new service offering.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="serviceName">
                Service Name *
              </Label>
              <Input
                id="serviceName"
                placeholder="Enter service name"
                value={newService.name || ""}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="serviceCategory">
                Category *
              </Label>
              <Select onValueChange={(value) => setNewService({ ...newService, category: value })}>
                <SelectTrigger>
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
                <Label htmlFor="servicePrice">
                  Price *
                </Label>
                <Input
                  id="servicePrice"
                  type="number"
                  placeholder="0.00"
                  value={newService.price || ""}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="serviceDuration">
                  Duration (min) *
                </Label>
                <Input
                  id="serviceDuration"
                  type="number"
                  placeholder="60"
                  value={newService.duration || ""}
                  onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="serviceDescription">
                Description
              </Label>
              <Textarea
                id="serviceDescription"
                placeholder="Service description..."
                value={newService.description || ""}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddServiceOpen(false)
                  setNewService({})
                }}
              >
                Cancel
              </Button>
              <Button
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>Update service information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="editServiceName">
                Service Name *
              </Label>
              <Input
                id="editServiceName"
                placeholder="Enter service name"
                value={editingService?.name || ""}
                onChange={(e) => setEditingService(editingService ? { ...editingService, name: e.target.value } : null)}
              />
            </div>
            <div>
              <Label htmlFor="editServiceCategory">
                Category *
              </Label>
              <Select
                value={editingService?.category || ""}
                onValueChange={(value) =>
                  setEditingService(editingService ? { ...editingService, category: value } : null)
                }
              >
                <SelectTrigger>
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
                <Label htmlFor="editServicePrice">
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
                />
              </div>
              <div>
                <Label htmlFor="editServiceDuration">
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
                />
              </div>
            </div>
            <div>
              <Label htmlFor="editServiceDescription">
                Description
              </Label>
              <Textarea
                id="editServiceDescription"
                placeholder="Service description..."
                value={editingService?.description || ""}
                onChange={(e) =>
                  setEditingService(editingService ? { ...editingService, description: e.target.value } : null)
                }
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditServiceOpen(false)
                  setEditingService(null)
                }}
              >
                Cancel
              </Button>
              <Button
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>Create a new service category.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="categoryName">
                Category Name *
              </Label>
              <Input
                id="categoryName"
                placeholder="Enter category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddCategoryOpen(false)
                  setNewCategory("")
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddCategory}
              >
                Add Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

        {/* Manage Order Modal */}
        <Dialog open={isManageOrderOpen} onOpenChange={setIsManageOrderOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manage Service Order</DialogTitle>
                    <DialogDescription>
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
                                                    className={`border transition-all duration-200 rounded-xl ${snapshot.isDragging
                                                            ? "shadow-lg scale-105 rotate-2 bg-accent"
                                                            : "hover:shadow-md cursor-grab active:cursor-grabbing"
                                                        }`}
                                                >
                                                    <CardContent className="p-3">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
                                                                    {index + 1}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold">{service.name}</h4>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {service.category} • ${service.price}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2 text-muted-foreground">
                                                                <div className="flex flex-col space-y-1">
                                                                    <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                                                                    <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                                                                    <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                                                                    <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                                                                    <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
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
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveOrder}
                    >
                        Save Order
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
        </div>
    </div>
  )
}
