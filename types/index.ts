import type React from "react"
export interface WooCommerceOrder {
  order_id: string
  customer_name: string
  customer_email: string
  order_date: string
  status: "completed" | "processing" | "pending" | "cancelled" | "refunded"
  total_amount: number
  currency: string
  payment_method: string
  items: {
    product_id: string
    product_name: string
    category: string
    quantity: number
    price: number
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

export interface KpiCardProps {
  title: string
  value: string
  comparisonValue?: string
  comparisonText?: string
  icon: React.ElementType
  progress?: number // Percentage 0-100
  currencySymbol?: string
}

export interface NavItem {
  title: string
  icon: React.ElementType
  href: string
  active?: boolean
  disabled?: boolean
  external?: boolean
  label?: string
  description?: string
  items?: NavItem[]
}
