import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PipelineStage {
  name: string
  value: string // e.g., "$74,569"
  count: string // e.g., "57 Deals"
}

interface SalesPipelineStagesProps {
  stages: PipelineStage[]
}

export function SalesPipelineStages({ stages }: SalesPipelineStagesProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Sales Pipeline</CardTitle>
        {/* Add options icon if needed */}
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stages.map((stage) => (
          <div key={stage.name} className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
            <h3 className="text-sm font-medium text-muted-foreground">{stage.name}</h3>
            <p className="text-2xl font-bold mt-1">{stage.value}</p>
            <p className="text-xs text-muted-foreground">{stage.count}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
