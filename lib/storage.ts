export function getItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Handle storage errors silently
  }
}

export function removeItem(key: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(key)
  } catch {
    // Handle storage errors silently
  }
}

// Simple localStorage wrapper for persisting status changes
export class LocalStorage {
  private static getKey(type: 'orders' | 'submissions', id: string): string {
    return `laguna_${type}_${id}_status`
  }

  static getOrderStatus(orderId: string): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.getKey('orders', orderId))
  }

  static setOrderStatus(orderId: string, status: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.getKey('orders', orderId), status)
  }

  static getSubmissionStatus(submissionId: string): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.getKey('submissions', submissionId))
  }

  static setSubmissionStatus(submissionId: string, status: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.getKey('submissions', submissionId), status)
  }

  static clearAll(): void {
    if (typeof window === 'undefined') return
    const keys = Object.keys(localStorage).filter(key => key.startsWith('laguna_'))
    keys.forEach(key => localStorage.removeItem(key))
  }
} 