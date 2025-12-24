export interface Order {
  id: string
  tableId: string
  status: OrderStatus 
  placedBy: string
  notes: string
  createdAt: Date
  createdBy: string
  items: {
    id: string 
    menuItemId: string
    name: string
    quantity: number 
    price: number
    notes?: string 
  }[]
  total: number
}

export type OrderStatus = "PENDING" | "PREPARING" | "READY" | "SERVED" | "CANCELLED"