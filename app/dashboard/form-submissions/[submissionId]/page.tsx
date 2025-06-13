"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { FormSubmission } from "@/types"
import { LocalStorage } from "@/lib/storage"
import submissionsData from "@/lib/data/cf7-submissions.json"

export default function SubmissionDetailPage() {
  const params = useParams()
  const submissionId = params.submissionId as string
  
  const [submission, setSubmission] = useState<FormSubmission | null>(null)
  const [currentStatus, setCurrentStatus] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!submissionId) return
    
    const submissions = submissionsData as FormSubmission[]
    const foundSubmission = submissions.find(s => s.id === submissionId)
    
    if (foundSubmission) {
      setSubmission(foundSubmission)
      // Check for saved status in localStorage, otherwise use original status
      const savedStatus = LocalStorage.getSubmissionStatus(submissionId)
      setCurrentStatus(savedStatus || foundSubmission.status)
    }
    setIsLoading(false)
  }, [submissionId])

  const handleStatusChange = (newStatus: FormSubmission['status']) => {
    if (!submission) return
    
    setCurrentStatus(newStatus)
    LocalStorage.setSubmissionStatus(submission.id, newStatus)
    
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('submissionStatusChanged', {
      detail: { submissionId: submission.id, newStatus }
    }))
  }

  const getStatusColor = (status: string) => {
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

  const exportToJSON = () => {
    if (!submission) return
    
    const dataStr = JSON.stringify(submission, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `submission-${submission.id}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Submission Not Found</h1>
        <p className="mt-2 text-gray-600">The form submission you're looking for doesn't exist.</p>
        <Link 
          href="/dashboard/form-submissions"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Back to Form Submissions
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
            href="/dashboard/form-submissions"
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
          >
            ← Back to Form Submissions
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{submission.form_name}</h1>
          <p className="text-gray-600">Submitted on {new Date(submission.submitted_at).toLocaleDateString()}</p>
        </div>
        
        {/* Status Dropdown */}
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value as FormSubmission['status'])}
              className={`px-3 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${getStatusColor(currentStatus)}`}
            >
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submission Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white shadow border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-sm text-gray-900">{submission.data.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm text-gray-900">{submission.data.email}</p>
              </div>
              {submission.data.subject && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Subject</p>
                  <p className="text-sm text-gray-900">{submission.data.subject}</p>
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="bg-white shadow border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Message</h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{submission.data.message}</p>
            </div>
          </div>

          {/* Additional Fields */}
          {Object.entries(submission.data).filter(([key]) => 
            !['name', 'email', 'subject', 'message'].includes(key)
          ).length > 0 && (
            <div className="bg-white shadow border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
              <div className="space-y-3">
                {Object.entries(submission.data)
                  .filter(([key]) => !['name', 'email', 'subject', 'message'].includes(key))
                  .map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm font-medium text-gray-500 capitalize">
                        {key.replace(/[_-]/g, ' ')}
                      </p>
                      <p className="text-sm text-gray-900">{String(value)}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Submission Summary */}
          <div className="bg-white shadow border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Submission Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Form Name</p>
                <p className="text-sm text-gray-900">{submission.form_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Submission ID</p>
                <p className="text-sm text-gray-900">#{submission.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date & Time</p>
                <p className="text-sm text-gray-900">
                  {new Date(submission.submitted_at).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Current Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(currentStatus)}`}>
                  {currentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleStatusChange('replied')}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mark as Replied
              </button>
              
              <button
                onClick={exportToJSON}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export JSON
              </button>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white shadow border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Export</h2>
            <button
              onClick={() => {
                const data = {
                  id: submission.id,
                  form_name: submission.form_name,
                  submitted_at: submission.submitted_at,
                  status: currentStatus,
                  ...submission.data
                }
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `submission-${submission.id}.json`
                a.click()
                window.URL.revokeObjectURL(url)
              }}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export as JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 