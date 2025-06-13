"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Order } from "@/types"
import { LocalStorage } from "@/lib/storage"
import ordersData from "@/lib/data/woocommerce-orders.json"

export default function OrderDetailPage() {
  const params = useParams()
  const orderId = params.orderId as string
  
  const [order, setOrder] = useState<Order | null>(null)
  const [currentStatus, setCurrentStatus] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!orderId) return
    
    const orders = ordersData as Order[]
    const foundOrder = orders.find(o => o.id === orderId)
    
    if (foundOrder) {
      setOrder(foundOrder)
      // Check for saved status in localStorage, otherwise use original status
      const savedStatus = LocalStorage.getOrderStatus(orderId)
      setCurrentStatus(savedStatus || foundOrder.status)
    }
    setIsLoading(false)
  }, [orderId])

  const handleStatusChange = (newStatus: Order['status']) => {
    if (!order) return
    
    setCurrentStatus(newStatus)
    LocalStorage.setOrderStatus(order.id, newStatus)
    
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('orderStatusChanged', {
      detail: { orderId: order.id, newStatus }
    }))
  }

  const getStatusColor = (status: string) => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Order Not Found</h1>
        <p className="mt-2 text-gray-600">The order you're looking for doesn't exist.</p>
        <Link 
          href="/dashboard/orders"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Back to Orders
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link 
            href="/dashboard/orders"
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
          >
            ← Back to Orders
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
          <p className="text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
        </div>
        
        {/* Status Dropdown */}
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Order Status
            </label>
            <select
              id="status"
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value as Order['status'])}
              className={`px-3 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${getStatusColor(currentStatus)}`}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white shadow border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-sm text-gray-900">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm text-gray-900">{order.customer.email}</p>
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div className="bg-white shadow border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Billing Address</h2>
            <div className="text-sm text-gray-900">
              <p>{order.billing_address.first_name} {order.billing_address.last_name}</p>
              {order.billing_address.company && <p>{order.billing_address.company}</p>}
              <p>{order.billing_address.address_1}</p>
              {order.billing_address.address_2 && <p>{order.billing_address.address_2}</p>}
              <p>{order.billing_address.city}, {order.billing_address.state} {order.billing_address.postcode}</p>
              <p>{order.billing_address.country}</p>
              {order.billing_address.phone && <p>Phone: {order.billing_address.phone}</p>}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white shadow border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
            <div className="text-sm text-gray-900">
              <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
              {order.shipping_address.company && <p>{order.shipping_address.company}</p>}
              <p>{order.shipping_address.address_1}</p>
              {order.shipping_address.address_2 && <p>{order.shipping_address.address_2}</p>}
              <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postcode}</p>
              <p>{order.shipping_address.country}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white shadow border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white shadow border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-gray-900">$0.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="text-gray-900">$0.00</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white shadow border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Order Notes</h2>
              <p className="text-sm text-gray-900">{order.notes}</p>
            </div>
          )}

          {/* Attached Files */}
          {order.attached_files && order.attached_files.length > 0 && (
            <div className="bg-white shadow border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Attached Files</h2>
              <div className="space-y-2">
                {order.attached_files.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <a 
                      href={file.url} 
                      download={file.name}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      {file.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 