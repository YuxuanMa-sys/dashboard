import { DollarSign, Users, TrendingUp, ShoppingCart, Filter, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { KpiCardStyled } from "@/components/analytics/kpi-card-styled"
import { SalesPipelineStages } from "@/components/analytics/sales-pipeline-stages"
import { PaymentRecordChart } from "@/components/payment-record-chart"
import { LatestLeadsTable } from "@/components/analytics/latest-leads-table"
import { OrderStatusPieChart } from "@/components/charts/order-status-pie-chart"
import { SalesByCategoryPieChart } from "@/components/charts/sales-by-category-pie-chart"
import { SubmissionStatusPieChart } from "@/components/charts/submission-status-pie-chart"
import { SubmissionsByFormDonutChart } from "@/components/charts/submissions-by-form-donut-chart"

import wooCommerceOrdersData from "@/lib/data/woocommerce-orders.json"
import cf7SubmissionsData from "@/lib/data/cf7-submissions.json"
import type { WooCommerceOrder, CF7Submission } from "@/types"

const orders: WooCommerceOrder[] = wooCommerceOrdersData as WooCommerceOrder[]
const submissions: CF7Submission[] = cf7SubmissionsData as CF7Submission[]

export default function AnalyticsPageRedesigned() {
  // --- Data Calculations ---
  const totalRevenue = orders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + order.total_amount, 0)
  const activeDealsValue = orders
    .filter((order) => ["processing", "pending"].includes(order.status))
    .reduce((sum, order) => sum + order.total_amount, 0)

  const newLeadsCount = submissions.filter((s) => s.status === "New").length
  const convertedLeadsCount = submissions.filter((s) => s.status === "Converted").length
  const leadConversionRate = submissions.length > 0 ? (convertedLeadsCount / submissions.length) * 100 : 0

  const lastMonthRevenue = totalRevenue * 0.85
  const revenueChangePercentage = ((totalRevenue - lastMonthRevenue) / (lastMonthRevenue || 1)) * 100

  const lastMonthActiveDeals = activeDealsValue * 0.9
  const activeDealsChangePercentage = ((activeDealsValue - lastMonthActiveDeals) / (lastMonthActiveDeals || 1)) * 100

  const lastMonthNewLeads = newLeadsCount * 0.7
  const newLeadsChangePercentage =
    newLeadsCount > 0 ? ((newLeadsCount - lastMonthNewLeads) / (lastMonthNewLeads || 1)) * 100 : 0

  const lastMonthConversionRate = leadConversionRate * 0.95
  const conversionRateChangePercentage =
    ((leadConversionRate - lastMonthConversionRate) / (lastMonthConversionRate || 1)) * 100

  const pipelineStages = [
    {
      name: "Leads",
      value: `$${(submissions.length * 150).toLocaleString()}`,
      count: `${submissions.length} Submissions`,
    },
    {
      name: "Contacted",
      value: `$${(submissions.filter((s) => s.status === "Contacted").length * 200).toLocaleString()}`,
      count: `${submissions.filter((s) => s.status === "Contacted").length} Submissions`,
    },
    {
      name: "Qualified",
      value: `$${(submissions.filter((s) => s.status === "Qualified").length * 500).toLocaleString()}`,
      count: `${submissions.filter((s) => s.status === "Qualified").length} Submissions`,
    },
    {
      name: "Converted",
      value: `$${(convertedLeadsCount * 1000).toLocaleString()}`,
      count: `${convertedLeadsCount} Deals`,
    },
  ]

  const revenueForecastPercentage = 63
  const marketingGoal = "$550/$1250 USD"
  const teamsGoal = "$550/$1250 USD"

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8 bg-muted/30">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-y-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Sales Analytics</h1>
          <p className="text-sm text-muted-foreground">Reports &gt; Home &gt; Sales</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Widgets
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <KpiCardStyled
          title="Active Deals"
          value={activeDealsValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          icon={ShoppingCart}
          comparisonValue={`${activeDealsChangePercentage.toFixed(1)}%`}
          comparisonText={`vs last month: $${lastMonthActiveDeals.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          comparisonTrend={activeDealsChangePercentage >= 0 ? "up" : "down"}
        />
        <KpiCardStyled
          title="Revenue Deals"
          value={totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          icon={DollarSign}
          comparisonValue={`${revenueChangePercentage.toFixed(1)}%`}
          comparisonText={`vs last month: $${lastMonthRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          comparisonTrend={revenueChangePercentage >= 0 ? "up" : "down"}
        />
        <KpiCardStyled
          title="New Leads"
          value={newLeadsCount.toString()}
          icon={Users}
          currencySymbol=""
          comparisonValue={`${newLeadsChangePercentage.toFixed(1)}%`}
          comparisonText={`vs last month: ${Math.round(lastMonthNewLeads)}`}
          comparisonTrend={newLeadsChangePercentage >= 0 ? "up" : "down"}
        />
        <KpiCardStyled
          title="Conversion Rate"
          value={`${leadConversionRate.toFixed(1)}%`}
          icon={TrendingUp}
          currencySymbol=""
          comparisonValue={`${conversionRateChangePercentage.toFixed(1)}%`}
          comparisonText={`vs last month: ${lastMonthConversionRate.toFixed(1)}%`}
          comparisonTrend={conversionRateChangePercentage >= 0 ? "up" : "down"}
        />
      </div>

      {/* Main Content Grid - Section 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-3 space-y-6">
          <SalesPipelineStages stages={pipelineStages} />
          <PaymentRecordChart orders={orders} />
        </div>
      </div>

      {/* Four Pie Charts Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Detailed Breakdowns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OrderStatusPieChart orders={orders} />
          <SalesByCategoryPieChart orders={orders} />
          <SubmissionStatusPieChart submissions={submissions} />
          <SubmissionsByFormDonutChart submissions={submissions} />
        </div>
      </div>

      {/* Latest Leads Table (Full Width) */}
      <div className="mb-6">
        <LatestLeadsTable leads={submissions} />
      </div>
    </div>
  )
}
