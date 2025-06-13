export interface WooCommerceOrder {
  order_id: string
  customer_name: string
  customer_email: string
  order_date: string
  status: "completed" | "processing" | "pending" | "cancelled" | "refunded"
  total_amount: number
  currency: string
  payment_method: string
  billing_address: {
    name: string
    address_line_1: string
    address_line_2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  shipping_address: {
    name: string
    address_line_1: string
    address_line_2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  items: {
    product_id: string
    product_name: string
    category: string
    quantity: number
    price: number
  }[]
  notes: string
  attached_files: {
    name: string
    url: string
    size: string
  }[]
}

export interface CF7Submission {
  submission_id: string
  form_id: string
  form_name: string
  submission_date: string
  status: "New" | "Contacted" | "Qualified" | "Converted" | "In Progress" | "Closed"
  fields: Record<string, string>
}

export interface NavItem {
  title: string
  href: string
  icon: any
}

export interface Order {
  id: string
  customer: {
    name: string
    email: string
  }
  date: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  total: number
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  billing_address: Address
  shipping_address: Address
  notes: string
  attached_files: Array<{
    name: string
    url: string
  }>
}

export interface Address {
  first_name: string
  last_name: string
  company: string
  address_1: string
  address_2: string
  city: string
  state: string
  postcode: string
  country: string
  phone?: string
}

export interface FormSubmission {
  id: string
  form_name: string
  submitted_at: string
  status: 'new' | 'read' | 'replied'
  data: {
    name: string
    email: string
    subject?: string
    message: string
    interests?: string
    [key: string]: any
  }
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export interface FilterOptions {
  status?: string
  dateFrom?: string
  dateTo?: string
  search?: string
}

export interface DashboardStats {
  totalOrders: number
  totalSubmissions: number
  totalRevenue: number
  totalCustomers: number
} 