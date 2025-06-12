"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { CF7Submission } from "@/types"
import React from "react"
import { useTheme } from "next-themes"

interface SubmissionStatusPieChartProps {
  submissions: CF7Submission[]
}

export function SubmissionStatusPieChart({ submissions }: SubmissionStatusPieChartProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const chartColorVars: Record<string, string> = {
    new: "hsl(var(--chart-4))",
    contacted: "hsl(var(--chart-1))",
    qualified: "hsl(var(--chart-6))",
    converted: "hsl(var(--chart-2))",
    "in progress": "hsl(var(--chart-3))",
    closed: "hsl(var(--muted-foreground))",
  }

  const statusCounts = submissions.reduce(
    (acc, sub) => {
      acc[sub.status] = (acc[sub.status] || 0) + 1
      return acc
    },
    {} as Record<CF7Submission["status"], number>,
  )

  const data = Object.entries(statusCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Form Submission Status</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Loading chart...</p>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Form Submission Status</CardTitle>
          <CardDescription>No submission data available.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data to display.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Submission Status</CardTitle>
        <CardDescription>Breakdown of form submissions by status.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 10, right: 10, bottom: 40, left: 10 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={false} // Remove in-slice labels
              outerRadius={100}
              innerRadius={50} // Donut chart
              fill="#8884d8"
              dataKey="value"
              stroke={theme === "dark" ? "hsl(var(--card))" : "hsl(var(--background))"}
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    chartColorVars[entry.name.toLowerCase() as keyof typeof chartColorVars] || "hsl(var(--chart-7))"
                  }
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [value, "Submissions"]}
              contentStyle={{
                fontSize: "12px",
                backgroundColor: theme === "dark" ? "rgba(30,41,59,0.9)" : "rgba(255,255,255,0.9)",
                borderColor: theme === "dark" ? "rgba(51,65,85,0.9)" : "rgba(226,232,240,0.9)",
                backdropFilter: "blur(4px)",
                borderRadius: "var(--radius)",
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
