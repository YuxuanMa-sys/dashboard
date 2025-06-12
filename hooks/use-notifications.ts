"use client"

import * as React from "react"
import { getItem, setItem } from "@/lib/storage"
import type { WooCommerceOrder, CF7Submission } from "@/types"
import initialOrdersData from "@/lib/data/woocommerce-orders.json"
import initialSubmissionsData from "@/lib/data/cf7-submissions.json"

const NOTIFICATIONS_READ_KEY = "duralux_read_notifications"

export type Notification = {
  id: string
  type: "order" | "submission"
  title: string
  description: string
  date: string
  isRead: boolean
}

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
}

const NotificationsContext = React.createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = React.useState<Notification[]>([])

  React.useEffect(() => {
    const readIds = getItem<string[]>(NOTIFICATIONS_READ_KEY) || []

    const orderNotifications: Notification[] = (initialOrdersData as WooCommerceOrder[]).slice(0, 5).map((order) => ({
      id: order.order_id,
      type: "order",
      title: `New Order: #${order.order_id}`,
      description: `From ${order.customer_name} for $${order.total_amount.toFixed(2)}`,
      date: order.order_date,
      isRead: readIds.includes(order.order_id),
    }))

    const submissionNotifications: Notification[] = (initialSubmissionsData as CF7Submission[])
      .slice(0, 5)
      .map((sub) => ({
        id: sub.submission_id,
        type: "submission",
        title: `New Lead: ${sub.fields["your-name"] || "N/A"}`,
        description: `From form: ${sub.form_name}`,
        date: sub.submission_date,
        isRead: readIds.includes(sub.submission_id),
      }))

    const allNotifications = [...orderNotifications, ...submissionNotifications].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )

    setNotifications(allNotifications)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === id && !n.isRead) {
          const readIds = getItem<string[]>(NOTIFICATIONS_READ_KEY) || []
          setItem(NOTIFICATIONS_READ_KEY, [...readIds, id])
          return { ...n, isRead: true }
        }
        return n
      }),
    )
  }

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id)
    setItem(NOTIFICATIONS_READ_KEY, allIds)
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = React.useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}
