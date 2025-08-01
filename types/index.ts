export interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
  notes: string
  status: "active" | "inactive" | string  // you can adjust status options if needed
  avatar?: string  // optional, since you sometimes fallback to placeholder
  lastVisit?: string  // e.g., "2024-07-25" or any formatted date string
  servicesCount?: number  // number of services the client used
  totalSpent?: number  // total amount spent by the client
}

export interface Staff {
  id:string
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
}

export interface Service {
  id: string
  name: string
  description?: string
  price: number
  duration: string // e.g. "30", "45", "60" minutes as string or "30min"
  category: string
}


export interface Booking {
  id: string
  clientId: string
  clientName: string
  serviceId: string
  serviceName: string
  staffId: string
  staffName: string
  date: Date | null
  time?: string
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

export interface RecentSale {
  id: string
  clientName: string
  serviceName: string
  amount: number
  date: string
}

export interface RecentSale {
  id: string
  clientName: string
  serviceName: string
  amount: number
  date: string
}
