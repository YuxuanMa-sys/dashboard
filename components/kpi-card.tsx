import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { KpiCardProps } from "@/types"

export function KpiCard({
  title,
  value,
  comparisonValue,
  comparisonText,
  icon: Icon,
  progress,
  currencySymbol = "$",
}: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {currencySymbol && !comparisonValue && value.match(/^\d/) ? currencySymbol : ""}
          {value}
        </div>
        {comparisonValue && (
          <p className="text-xs text-muted-foreground">
            {currencySymbol}
            {comparisonValue} {comparisonText}
          </p>
        )}
        {progress !== undefined && <Progress value={progress} className="mt-2 h-2" />}
      </CardContent>
    </Card>
  )
}
