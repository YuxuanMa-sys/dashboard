"use client"

import React from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { WooCommerceOrder } from "@/types"

interface PaymentRecordChartProps {
  orders: WooCommerceOrder[]
}

export function PaymentRecordChart({ orders }: PaymentRecordChartProps) {
  const monthlySales = React.useMemo(() => {
    const sales: Record<string, number> = {}
    orders.forEach((order) => {
      if (order.status === "completed") {
        const month = new Date(order.order_date)
          .toLocaleString("default", { month: "short", year: "2-digit" })
          .replace(" ", "") // Format like "JUN25"
        sales[month] = (sales[month] || 0) + order.total_amount
      }
    })

    // Ensure we have data for the last 12 months, even if it's 0
    const last12Months: { name: string; total: number }[] = []
    const currentDate = new Date()
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthKey = date.toLocaleString("default", { month: "short", year: "2-digit" }).replace(" ", "")
      last12Months.push({ name: monthKey, total: sales[monthKey] || 0 })
    }
    return last12Months
  }, [orders])

  const formatYAxis = (tickItem: number) => {
    if (tickItem >= 1000) {
      return `${tickItem / 1000}K`
    }
    return tickItem.toString()
  }

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Payment Record</CardTitle>
        <CardDescription>Sales overview for the last months.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlySales}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
              domain={[0, "dataMax + 10000"]}
            />
            <Tooltip
              formatter={(value: number) => {
                return [`$${value.toFixed(2)}`, "Total Sales"]
              }}
            />
            <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: "20px" }} />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Total Sales" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
