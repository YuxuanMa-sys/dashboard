"use client"

import { DollarSign, ShoppingCart, FileInput } from "lucide-react"
import wooCommerceOrdersData from "@/lib/data/woocommerce-orders.json"
import cf7SubmissionsData from "@/lib/data/cf7-submissions.json"
import type { WooCommerceOrder, CF7Submission } from "@/types"

const orders: WooCommerceOrder[] = wooCommerceOrdersData as WooCommerceOrder[]
const submissions: CF7Submission[] = cf7SubmissionsData as CF7Submission[]

export function KpiSummary() {
  const totalRevenue = orders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + order.total_amount, 0)
  const newOrdersCount = orders.filter((o) => o.status === "pending").length
  const totalSubmissionsCount = submissions.length

  return (
    <div className="p-2 space-y-2 border-t">
      <h3 className="text-xs font-semibold text-muted-foreground px-2">This Month's Stats</h3>
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span>Revenue</span>
          </div>
          <span className="font-semibold">${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-blue-500" />
            <span>New Orders</span>
          </div>
          <span className="font-semibold">{newOrdersCount}</span>
        </div>
        <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted">
          <div className="flex items-center gap-2">
            <FileInput className="h-4 w-4 text-orange-500" />
            <span>Submissions</span>
          </div>
          <span className="font-semibold">{totalSubmissionsCount}</span>
        </div>
      </div>
    </div>
  )
}
