import Link from "next/link"
import { DollarSign, Users, TrendingUp, ShoppingCart, ArrowRight, BarChart3, FileInput, LayoutGrid } from "lucide-react"
import { KpiCardStyled } from "@/components/analytics/kpi-card-styled" // Use the styled one
import { PaymentRecordChart } from "@/components/payment-record-chart"
import { TopProductsList } from "@/components/top-products-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import wooCommerceOrdersData from "@/lib/data/woocommerce-orders.json"
import cf7SubmissionsData from "@/lib/data/cf7-submissions.json"
import type { WooCommerceOrder, CF7Submission } from "@/types"
import { SalesByCategoryPieChart } from "@/components/charts/sales-by-category-pie-chart" // For a summary view
import { OrderStatusPieChart } from "@/components/charts/order-status-pie-chart" // For a summary view

const orders: WooCommerceOrder[] = wooCommerceOrdersData as WooCommerceOrder[]
const submissions: CF7Submission[] = cf7SubmissionsData as CF7Submission[]

export default function DashboardOverviewPage() {
  // --- Key Metric Calculations ---
  const totalRevenue = orders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + order.total_amount, 0)
  const activeOrdersCount = orders.filter((o) => ["processing", "pending"].includes(o.status)).length
  const totalCompletedOrders = orders.filter((o) => o.status === "completed").length

  const newLeadsCount = submissions.filter((s) => s.status === "New").length
  const totalSubmissionsCount = submissions.length
  const convertedLeadsCount = submissions.filter((s) => s.status === "Converted").length
  const leadConversionRate = totalSubmissionsCount > 0 ? (convertedLeadsCount / totalSubmissionsCount) * 100 : 0

  // Mock "vs last month" data for KPIs
  const lastMonthRevenue = totalRevenue * 0.85 // Example: 15% less last month
  const revenueChangePercentage =
    totalRevenue > 0 ? ((totalRevenue - lastMonthRevenue) / (lastMonthRevenue || 1)) * 100 : 0

  return (
    <div className="flex-1 space-y-8 p-4 md:p-6 lg:p-8 bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Dashboard Overview</h1>
        <Button asChild>
          <Link href="/dashboard/analytics">
            View Full Analytics <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Main KPI Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCardStyled
          title="Total Revenue"
          value={totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          icon={DollarSign}
          comparisonValue={`${revenueChangePercentage.toFixed(1)}%`}
          comparisonText="vs last month"
          comparisonTrend={revenueChangePercentage >= 0 ? "up" : "down"}
        />
        <KpiCardStyled
          title="Active Orders"
          value={activeOrdersCount.toString()}
          icon={ShoppingCart}
          currencySymbol=""
          comparisonText={`${totalCompletedOrders} completed`}
        />
        <KpiCardStyled
          title="New Leads"
          value={newLeadsCount.toString()}
          icon={Users}
          currencySymbol=""
          comparisonText={`${totalSubmissionsCount} total submissions`}
        />
        <KpiCardStyled
          title="Lead Conversion Rate"
          value={`${leadConversionRate.toFixed(1)}%`}
          icon={TrendingUp}
          currencySymbol=""
          comparisonText={`${convertedLeadsCount} converted`}
        />
      </div>

      {/* Charts & Summaries Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Sales Trend & Top Products */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Recent Sales Trend</CardTitle>
              <CardDescription>Overview of sales from completed orders.</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentRecordChart orders={orders} />
            </CardContent>
          </Card>
          <TopProductsList orders={orders} /> {/* Ensure this component is styled with shadow-xl etc. */}
        </div>

        {/* Right Column: Quick Summaries - Order Status & Sales by Category */}
        <div className="space-y-6">
          <OrderStatusPieChart orders={orders} /> {/* Already styled with shadow-lg */}
          <SalesByCategoryPieChart orders={orders} /> {/* Already styled with shadow-lg */}
        </div>
      </div>

      {/* Quick Navigation Links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Manage Orders</CardTitle>
            <ShoppingCart className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-2">View, edit, and track all customer orders.</p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/dashboard/orders">
                Go to Orders <ArrowRight className="ml-2 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Form Submissions</CardTitle>
            <FileInput className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-2">Review and manage all incoming leads.</p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/dashboard/form-submissions">
                Go to Submissions <ArrowRight className="ml-2 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Detailed Analytics</CardTitle>
            <BarChart3 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-2">Dive deeper into sales and lead data.</p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/dashboard/analytics">
                Go to Analytics <ArrowRight className="ml-2 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">App Settings</CardTitle>
            <LayoutGrid className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-2">Configure application preferences.</p>
            <Button variant="outline" size="sm" className="w-full">
              Configure Settings <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
