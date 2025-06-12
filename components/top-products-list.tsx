"use client"

import React from "react"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { WooCommerceOrder } from "@/types"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

interface TopProductsListProps {
  orders: WooCommerceOrder[]
}

interface ProductSale {
  name: string
  category: string // Assuming a category, or derive/mock
  sales: number
  totalAmount: number
  imageUrl?: string
}

export function TopProductsList({ orders }: TopProductsListProps) {
  const productSales = React.useMemo(() => {
    const salesMap: Record<string, { count: number; total: number; name: string }> = {}
    orders.forEach((order) => {
      if (order.status === "completed") {
        order.items.forEach((item) => {
          salesMap[item.product_id] = salesMap[item.product_id] || { count: 0, total: 0, name: item.product_name }
          salesMap[item.product_id].count += item.quantity
          salesMap[item.product_id].total += item.quantity * item.price
        })
      }
    })

    // Example products from screenshot
    const exampleProducts: ProductSale[] = [
      {
        name: "Shopify eCommerce Store",
        category: "Electronics",
        sales: 0,
        totalAmount: 0,
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
      {
        name: "iOS Apps Development",
        category: "Electronics",
        sales: 0,
        totalAmount: 0,
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
      {
        name: "Figma Dashboard Design",
        category: "Electronics",
        sales: 0,
        totalAmount: 0,
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
    ]

    exampleProducts.forEach((ep) => {
      const matchedOrder = orders.find((o) => o.items.some((i) => i.product_name.includes(ep.name.split(" ")[0]))) // Simple match
      if (matchedOrder) {
        const matchedItem = matchedOrder.items.find((i) => i.product_name.includes(ep.name.split(" ")[0]))
        if (matchedItem) {
          ep.sales = matchedItem.quantity
          ep.totalAmount = matchedItem.price * matchedItem.quantity
        }
      }
    })

    return exampleProducts
      .filter((p) => p.totalAmount > 0)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 3)
  }, [orders])

  return (
    <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-lg col-span-1 md:col-span-1 lg:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-semibold">Top Selling Products</CardTitle>
          <CardDescription className="text-sm">Based on recent sales data.</CardDescription>
        </div>
        <Button variant="ghost" size="sm">
          View All <ArrowUpRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        {productSales.length === 0 ? (
          <p className="text-muted-foreground">No sales data available for top products.</p>
        ) : (
          <ul className="space-y-4">
            {productSales.map((product) => (
              <li key={product.name} className="flex items-center gap-4">
                <Image
                  src={
                    product.imageUrl || `/placeholder.svg?height=40&width=40&query=${encodeURIComponent(product.name)}`
                  }
                  alt={product.name}
                  width={40}
                  height={40}
                  className="rounded-md"
                />
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${product.totalAmount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{product.sales} sold</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
