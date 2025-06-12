import Link from "next/link"
import { ArrowLeft, Printer, CreditCard, Package, User, HomeIcon, ShoppingBag } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import wooCommerceOrdersData from "@/lib/data/woocommerce-orders.json"
import type { WooCommerceOrder } from "@/types"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

async function getOrderDetails(orderId: string): Promise<WooCommerceOrder | undefined> {
  const orders = wooCommerceOrdersData as WooCommerceOrder[]
  return orders.find((o) => o.order_id === orderId)
}

export default async function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const order = await getOrderDetails(params.orderId)

  if (!order) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6 text-center">
        <h2 className="text-2xl font-bold">Order Not Found</h2>
        <p>The requested order could not be found.</p>
        <Button asChild>
          <Link href="/dashboard/orders">Back to Orders</Link>
        </Button>
      </div>
    )
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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/orders">Orders</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Order {order.order_id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild className="h-7 w-7">
            <Link href="/dashboard/orders">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Order {order.order_id}
          </h1>
          <Badge variant={getStatusBadgeVariant(order.status)} className="ml-2 capitalize">
            {order.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" /> Print Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Customer</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="font-medium">{order.customer_name}</p>
            <p className="text-sm text-muted-foreground">{order.customer_email}</p>
            {/* Add more customer details if available, e.g., phone, address */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Order Details</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p>Date: {new Date(order.order_date).toLocaleDateString()}</p>
            <p>Payment: {order.payment_method}</p>
            {/* Add shipping method if available */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Total Amount</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: order.currency || "USD",
              }).format(order.total_amount)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
          <CardDescription>Products included in this order.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.product_id}>
                  <TableCell>{item.product_name}</TableCell>
                  <TableCell>{item.product_id}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency || "USD" }).format(
                      item.price,
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency || "USD" }).format(
                      item.price * item.quantity,
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t pt-4">
          <div className="grid gap-0.5 text-right">
            <div className="text-muted-foreground">Subtotal:</div>
            <div className="text-muted-foreground">Shipping:</div>
            <div className="font-medium">Total:</div>
          </div>
          <div className="grid gap-0.5 text-right">
            <div>
              {new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency || "USD" }).format(
                order.total_amount,
              )}
            </div>
            <div>$0.00</div> {/* Assuming no separate shipping for now */}
            <div className="font-medium">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency || "USD" }).format(
                order.total_amount,
              )}
            </div>
          </div>
        </CardFooter>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Billing Address</CardTitle>
            <HomeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p>{order.customer_name}</p>
            <p>123 Billing St.</p>
            <p>City, State, 12345</p>
            <p>Country</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Shipping Address</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p>{order.customer_name}</p>
            <p>456 Shipping Ave.</p>
            <p>City, State, 67890</p>
            <p>Country</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No notes for this order.</p>
          {/* Or display actual notes if available */}
        </CardContent>
      </Card>
    </div>
  )
}
