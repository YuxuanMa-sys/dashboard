"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Users } from "lucide-react"

interface RevenueForecastChartProps {
  percentage: number
  marketingGoal: string
  teamsGoal: string
}

export function RevenueForecastChart({ percentage, marketingGoal, teamsGoal }: RevenueForecastChartProps) {
  const circumference = 2 * Math.PI * 45 // Assuming radius of 45 for the progress circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <Card className="shadow-sm flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Revenue Forecast</CardTitle>
        {/* Add options icon if needed */}
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center flex-grow">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              className="text-muted/20"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            {/* Progress circle */}
            <circle
              className="text-primary"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
              transform="rotate(-90 50 50)"
            />
            {/* Text in the middle */}
            <text x="50" y="50" textAnchor="middle" dy=".3em" className="text-4xl font-bold fill-foreground">
              {percentage}%
            </text>
          </svg>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 w-full text-center">
          <div className="flex flex-col items-center">
            <Target className="h-6 w-6 text-muted-foreground mb-1" />
            <p className="text-xs text-muted-foreground">Marketing Goal</p>
            <p className="text-sm font-semibold">{marketingGoal}</p>
          </div>
          <div className="flex flex-col items-center">
            <Users className="h-6 w-6 text-muted-foreground mb-1" />
            <p className="text-xs text-muted-foreground">Teams Goal</p>
            <p className="text-sm font-semibold">{teamsGoal}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
