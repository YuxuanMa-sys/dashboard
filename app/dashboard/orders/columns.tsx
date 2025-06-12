"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { ArrowUpDown, MoreHorizontal, Eye } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { WooCommerceOrder } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface OrderColumnsProps {
  onCopyOrderId: (orderId: string) => void
  onMarkAsProcessing: (orderId: string) => void
}

const getStatusBadgeVariant = (status: WooCommerceOrder["status"]) => {
  switch (status) {
    case "completed":
      return "success"
    case "processing":
      return "default"
    case "pending":
      return "warning"
    case "cancelled":
      return "destructive"
    case "refunded":
      return "outline"
    default:
      return "secondary"
  }
}

export const getOrderColumns = ({
  onCopyOrderId,
  onMarkAsProcessing,
}: OrderColumnsProps): ColumnDef<WooCommerceOrder>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "order_id",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Order ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("order_id")}</div>,
  },
  {
    accessorKey: "customer_name",
    header: "Customer",
    cell: ({ row }) => {
      const order = row.original
      return (
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${order.customer_name.charAt(0)}`} />
            <AvatarFallback>{order.customer_name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div>{order.customer_name}</div>
            <div className="text-xs text-muted-foreground">{order.customer_email}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "items",
    header: "Primary Item",
    cell: ({ row }) => {
      const items = row.getValue("items") as WooCommerceOrder["items"]
      if (!items || items.length === 0) {
        return <span className="text-muted-foreground">No items</span>
      }
      const primaryItem = items[0]
      return (
        <div>
          <div className="font-medium truncate w-40" title={primaryItem.product_name}>
            {primaryItem.product_name}
          </div>
          <div className="text-xs text-muted-foreground">{primaryItem.category}</div>
          {items.length > 1 && <div className="text-xs text-muted-foreground">+{items.length - 1} more</div>}
        </div>
      )
    },
    enableSorting: false, // Sorting on complex objects can be tricky without custom logic
  },
  {
    accessorKey: "total_amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-right w-full justify-end"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("total_amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: row.original.currency || "USD",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "order_date",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) =>
      new Date(row.getValue("order_date")).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={getStatusBadgeVariant(row.getValue("status"))} className="capitalize">
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original
      return (
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/orders/${order.order_id}`}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">View order</span>
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onCopyOrderId(order.order_id)}>Copy Order ID</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/orders/${order.order_id}`}>View order details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMarkAsProcessing(order.order_id)}>Mark as Processing</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Cancel Order</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
