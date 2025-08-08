"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Filter, Plus, Edit, Eye, Settings, Trash2, MoreHorizontal } from "lucide-react"
import type { Service } from "@/types"
import { useDebounce } from "@/hooks/use-debounce"

interface ServicesPageContentProps {
  services: Service[]
  serviceCategories: string[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  setIsAddCategoryOpen: (isOpen: boolean) => void
  setIsAddServiceOpen: (isOpen: boolean) => void
  setEditingService: (service: Service | null) => void
  setIsEditServiceOpen: (isOpen: boolean) => void
  openDeleteConfirm: (type: string, id: string, name: string) => void
  setIsManageOrderOpen: (isOpen: boolean) => void
  setReorderingServices: (services: Service[]) => void
}

export function ServicesPageContent({
  services: initialServices,
  serviceCategories,
  selectedCategory,
  setSelectedCategory,
  setIsAddCategoryOpen,
  setIsAddServiceOpen,
  setEditingService,
  setIsEditServiceOpen,
  openDeleteConfirm,
  setIsManageOrderOpen,
  setReorderingServices,
}: ServicesPageContentProps) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false)
  const [isEditServiceDialogOpen, setIsEditServiceDialogOpen] = useState(false)
  const [currentService, setCurrentService] = useState<Service | null>(null)
  const [newService, setNewService] = useState<Omit<Service, "id">>({
    name: "",
    description: "",
    price: 0,
    duration: "",
    category: "",
  })
  const [serviceSearch, setServiceSearch] = useState("")
  const debouncedServiceSearch = useDebounce(serviceSearch, 300)

  const handleAddService = () => {
    const id = (services.length + 1).toString()
    setServices([...services, { id, ...newService }])
    setNewService({ name: "", description: "", price: 0, duration: "", category: "" })
    setIsAddServiceDialogOpen(false)
  }

  const handleEditService = () => {
    if (currentService) {
      setServices(services.map((service) => (service.id === currentService.id ? currentService : service)))
      setCurrentService(null)
      setIsEditServiceDialogOpen(false)
    }
  }

  const handleDeleteService = (id: string) => {
    setServices(services.filter((service) => service.id !== id))
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

        {/* Add Service Dialog */}
        <Dialog open={isAddServiceDialogOpen} onOpenChange={setIsAddServiceDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
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
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: Number.parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">
                  Duration
                </Label>
                <Input
                  id="duration"
                  value={newService.duration}
                  onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Input
                  id="category"
                  value={newService.category}
                  onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleAddService}
                className="bg-roseDark hover:bg-roseMedium text-roseBackground-foreground"
              >
                Add Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Service Dialog */}
        <Dialog open={isEditServiceDialogOpen} onOpenChange={setIsEditServiceDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={currentService?.name || ""}
                  onChange={(e) =>
                    setCurrentService(currentService ? { ...currentService, name: e.target.value } : null)
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="edit-description"
                  value={currentService?.description || ""}
                  onChange={(e) =>
                    setCurrentService(currentService ? { ...currentService, description: e.target.value } : null)
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
                  value={currentService?.price || 0}
                  onChange={(e) =>
                    setCurrentService(
                      currentService ? { ...currentService, price: Number.parseFloat(e.target.value) } : null,
                    )
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-duration" className="text-right">
                  Duration
                </Label>
                <Input
                  id="edit-duration"
                  value={currentService?.duration || ""}
                  onChange={(e) =>
                    setCurrentService(currentService ? { ...currentService, duration: e.target.value } : null)
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
                  value={currentService?.category || ""}
                  onChange={(e) =>
                    setCurrentService(currentService ? { ...currentService, category: e.target.value } : null)
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleEditService}
                className="bg-roseDark hover:bg-roseMedium text-roseBackground-foreground"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
