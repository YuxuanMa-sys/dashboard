import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface KpiCardStyledProps {
  title: string
  value: string
  icon: LucideIcon
  comparisonValue?: string
  comparisonText?: string
  comparisonTrend?: "up" | "down" | "neutral"
  currencySymbol?: string
}

export function KpiCardStyled({
  title,
  value,
  icon: Icon,
  comparisonValue,
  comparisonText,
  comparisonTrend = "neutral",
  currencySymbol = "$",
}: KpiCardStyledProps) {
  const trendColor =
    comparisonTrend === "up" ? "text-green-500" : comparisonTrend === "down" ? "text-red-500" : "text-muted-foreground"

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {value.match(/^\d/) && currencySymbol ? currencySymbol : ""}
          {value}
        </div>
        {comparisonValue && (
          <p className="text-xs text-muted-foreground">
            <span className={cn("font-semibold", trendColor)}>{comparisonValue}</span> {comparisonText}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
