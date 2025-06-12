"use client"

import * as React from "react"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { useToast } from "@/components/ui/use-toast"
import initialOrdersData from "@/lib/data/woocommerce-orders.json"
import type { WooCommerceOrder } from "@/types"
import { getOrderColumns } from "./columns"
import { getItem, setItem } from "@/lib/storage"

const ORDERS_STORAGE_KEY = "duralux_orders_data"

export default function OrdersPage() {
  const [ordersData, setOrdersData] = React.useState<WooCommerceOrder[]>(() => {
    const storedOrders = getItem<WooCommerceOrder[]>(ORDERS_STORAGE_KEY)
    return storedOrders || (initialOrdersData as WooCommerceOrder[])
  })
  const { toast } = useToast()

  React.useEffect(() => {
    setItem(ORDERS_STORAGE_KEY, ordersData)
  }, [ordersData])

  const handleCopyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(orderId).then(
      () => {
        toast({
          title: "Copied!",
          description: `Order ID ${orderId} copied to clipboard.`,
        })
      },
      (err) => {
        toast({
          title: "Error",
          description: "Failed to copy Order ID.",
          variant: "destructive",
        })
        console.error("Could not copy text: ", err)
      },
    )
  }

  const handleMarkAsProcessing = (orderId: string) => {
    setOrdersData((prevOrders) =>
      prevOrders.map((order) => (order.order_id === orderId ? { ...order, status: "processing" } : order)),
    )
    toast({
      title: "Order Updated",
      description: `Order ${orderId} marked as processing.`,
    })
  }

  const columns = React.useMemo(
    () => getOrderColumns({ onCopyOrderId: handleCopyOrderId, onMarkAsProcessing: handleMarkAsProcessing }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">Manage and view customer orders.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Order
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={ordersData} filterColumnId="customer_name" createText="Create Order" />
    </div>
  )
}
