export interface Client {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  firstVisit: string
  servicesCount: number
  totalSpent: number
  lastVisit: string
  notes?: string
  status: "active" | "inactive"
}

export interface Staff {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  specialty: string
  availability: string
  rating: number
  hireDate: string
  isActive: boolean
  totalRevenue: number
  color: string // Tailwind class for badge color
}

export interface Service {
  id: string
  name: string
  category: string
  price: number
  duration: number
  description: string
  isActive: boolean
  icon: string
  color: string // Tailwind class for badge color
}

export interface Booking {
  id: string
  clientId: string
  clientName: string
  serviceId: string
  serviceName: string
  staffId: string
  staffName: string
  date: string
  time: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  notes?: string
  price: number
}

export interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  supplier: string
  reorderLevel: number
  unitPrice: number
  lastRestocked: string
  status: "in-stock" | "low-stock" | "out-of-stock" | "reorder"
}

export interface Invoice {
  id: string
  clientId: string
  clientName: string
  bookingId: string
  total: number
  status: "paid" | "pending" | "overdue"
  date: string
  dueDate: string
  items: InvoiceItem[]
}

interface InvoiceItem {
  serviceId: string
  serviceName: string
  quantity: number
  price: number
  total: number
}
