"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Order, FormSubmission, DashboardStats } from "@/types"
import { LocalStorage } from "@/lib/storage"
import ordersData from "@/lib/data/woocommerce-orders.json"
import submissionsData from "@/lib/data/cf7-submissions.json"

export default function DashboardPage() {
  const [ordersWithStatus, setOrdersWithStatus] = useState<Order[]>([])
  const [submissionsWithStatus, setSubmissionsWithStatus] = useState<FormSubmission[]>([])

  // Load data with stored status on mount
  useEffect(() => {
    const loadData = () => {
      const orders = ordersData as Order[]
      const ordersWithStoredStatus = orders.map(order => ({
        ...order,
        status: (LocalStorage.getOrderStatus(order.id) || order.status) as Order['status']
      }))
      setOrdersWithStatus(ordersWithStoredStatus)

      const submissions = submissionsData as FormSubmission[]
      const submissionsWithStoredStatus = submissions.map(submission => ({
        ...submission,
        status: (LocalStorage.getSubmissionStatus(submission.id) || submission.status) as FormSubmission['status']
      }))
      setSubmissionsWithStatus(submissionsWithStoredStatus)
    }

    loadData()

    // Listen for status changes from detail pages
    const handleOrderStatusChange = () => {
      loadData()
    }

    const handleSubmissionStatusChange = () => {
      loadData()
    }

    window.addEventListener('orderStatusChanged', handleOrderStatusChange)
    window.addEventListener('submissionStatusChanged', handleSubmissionStatusChange)
    
    return () => {
      window.removeEventListener('orderStatusChanged', handleOrderStatusChange)
      window.removeEventListener('submissionStatusChanged', handleSubmissionStatusChange)
    }
  }, [])

  // Calculate stats
  const stats: DashboardStats = {
    totalOrders: ordersWithStatus.length,
    totalSubmissions: submissionsWithStatus.length,
    totalRevenue: ordersWithStatus.reduce((sum, order) => sum + order.total, 0),
    totalCustomers: new Set(ordersWithStatus.map(order => order.customer.email)).size
  }

  // Get recent orders (last 5)
  const recentOrders = ordersWithStatus
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  // Get recent submissions (last 5)
  const recentSubmissions = submissionsWithStatus
    .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
    .slice(0, 5)

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSubmissionStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'read':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'replied':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome to Laguna Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Your comprehensive business overview at a glance
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                    <span className="ml-2 text-sm font-medium text-green-600">+12%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">Form Submissions</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold text-gray-900">{stats.totalSubmissions}</p>
                    <span className="ml-2 text-sm font-medium text-green-600">+4%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
                    <span className="ml-2 text-sm font-medium text-green-600">+8%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">Customers</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                    <span className="ml-2 text-sm font-medium text-green-600">+19%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                  <Link 
                    href="/dashboard/orders"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    View all →
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Link 
                            href={`/dashboard/orders/${order.id}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            #{order.id}
                          </Link>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getOrderStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{order.customer.name}</p>
                        <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {recentOrders.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p>No recent orders</p>
                </div>
              )}
            </div>

            {/* Recent Submissions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-teal-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Submissions</h3>
                  <Link 
                    href="/dashboard/form-submissions"
                    className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors"
                  >
                    View all →
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {recentSubmissions.map((submission) => (
                  <div key={submission.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Link 
                            href={`/dashboard/form-submissions/${submission.id}`}
                            className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors"
                          >
                            {submission.form_name}
                          </Link>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getSubmissionStatusColor(submission.status)}`}>
                            {submission.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{submission.data.name}</p>
                        <p className="text-xs text-gray-500">{new Date(submission.submitted_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 max-w-32 truncate">
                          {submission.data.subject || 'No subject'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {recentSubmissions.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>No recent submissions</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/dashboard/orders"
                className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">View Orders</p>
                  <p className="text-xs text-gray-600">Manage all orders</p>
                </div>
              </Link>

              <Link
                href="/dashboard/form-submissions"
                className="flex items-center p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200 hover:from-green-100 hover:to-teal-100 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-700 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">View Submissions</p>
                  <p className="text-xs text-gray-600">Review form data</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 