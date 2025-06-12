"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { WooCommerceOrder } from "@/types"
import { useTheme } from "next-themes"
import React from "react"

interface SalesByCategoryPieChartProps {
  orders: WooCommerceOrder[]
}

export function SalesByCategoryPieChart({ orders }: SalesByCategoryPieChartProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const salesByCategory = orders.reduce(
    (acc, order) => {
      if (order.status === "completed") {
        order.items.forEach((item) => {
          const category = item.category || "Uncategorized"
          acc[category] = (acc[category] || 0) + item.price * item.quantity
        })
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const data = Object.entries(salesByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const chartColorVars = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-6))",
    "hsl(var(--chart-7))",
  ]

  if (!mounted) {
    return (
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Sales by Product Category</CardTitle>
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
          <CardTitle className="text-lg font-semibold">Sales by Product Category</CardTitle>
          <CardDescription className="text-sm">No sales data available for categories.</CardDescription>
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
        <CardTitle className="text-lg font-semibold">Sales by Product Category</CardTitle>
        <CardDescription className="text-sm">Revenue distribution across product categories.</CardDescription>
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
              stroke={theme === "dark" ? "hsl(var(--card))" : "hsl(var(--background))"}
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColorVars[index % chartColorVars.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                name,
              ]}
              contentStyle={{
                backgroundColor: theme === "dark" ? "rgba(30,41,59,0.9)" : "rgba(255,255,255,0.9)",
                borderColor: theme === "dark" ? "rgba(51,65,85,0.9)" : "rgba(226,232,240,0.9)",
                backdropFilter: "blur(4px)",
                borderRadius: "var(--radius)",
                fontSize: "12px",
                padding: "8px 12px",
              }}
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
