"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { WooCommerceOrder } from "@/types"
import { useTheme } from "next-themes"
import React from "react"

interface OrderStatusPieChartProps {
  orders: WooCommerceOrder[]
  title?: string
}

export function OrderStatusPieChart({ orders, title = "Order Status Distribution" }: OrderStatusPieChartProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const chartColorVars: Record<string, string> = {
    completed: "hsl(var(--chart-6))",
    processing: "hsl(var(--chart-4))",
    pending: "hsl(var(--chart-3))",
    cancelled: "hsl(var(--chart-5))",
    refunded: "hsl(var(--muted-foreground))",
  }

  const statusCounts = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const data = Object.entries(statusCounts)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      statusKey: name,
    }))
    .sort((a, b) => b.value - a.value)

  if (!mounted) {
    return (
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Loading chart...</p>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">No order data available.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data to display.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Breakdown of orders by current status.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 10, right: 10, bottom: 40, left: 10 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={false}
              outerRadius={100}
              innerRadius={50}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              stroke={theme === "dark" ? "hsl(var(--card))" : "hsl(var(--background))"}
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColorVars[entry.statusKey] || "hsl(var(--chart-1))"} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                fontSize: "12px",
                backgroundColor: theme === "dark" ? "rgba(30,41,59,0.9)" : "rgba(255,255,255,0.9)",
                borderColor: theme === "dark" ? "rgba(51,65,85,0.9)" : "rgba(226,232,240,0.9)",
                backdropFilter: "blur(4px)",
                borderRadius: "var(--radius)",
                padding: "8px 12px",
              }}
              formatter={(value, name) => [`${value} orders`, name]}
            />
            <Legend
              iconSize={10}
              wrapperStyle={{ fontSize: "12px", paddingTop: "10px", bottom: 0 }}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
