"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { FormSubmission, FilterOptions, PaginationInfo } from "@/types"
import { LocalStorage } from "@/lib/storage"
import submissionsData from "@/lib/data/cf7-submissions.json"

const ITEMS_PER_PAGE = 10

interface SubmissionFilterOptions extends FilterOptions {
  subject?: string
}

export default function FormSubmissionsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<SubmissionFilterOptions>({
    status: '',
    search: '',
    dateFrom: '',
    dateTo: '',
    subject: ''
  })
  const [submissionsWithStatus, setSubmissionsWithStatus] = useState<FormSubmission[]>([])

  // Load submissions with stored status on mount
  useEffect(() => {
    const loadSubmissions = () => {
      const submissions = submissionsData as FormSubmission[]
      const submissionsWithStoredStatus = submissions.map(submission => ({
        ...submission,
        status: (LocalStorage.getSubmissionStatus(submission.id) || submission.status) as FormSubmission['status']
      }))
      setSubmissionsWithStatus(submissionsWithStoredStatus)
    }

    loadSubmissions()

    // Listen for status changes from detail pages
    const handleStatusChange = () => {
      loadSubmissions()
    }

    window.addEventListener('submissionStatusChanged', handleStatusChange)
    
    return () => {
      window.removeEventListener('submissionStatusChanged', handleStatusChange)
    }
  }, [])

  // Get unique subjects for filter
  const uniqueSubjects = useMemo(() => {
    return Array.from(new Set(submissionsWithStatus.map(s => s.data.subject).filter(Boolean)))
  }, [submissionsWithStatus])

  // Filter and search submissions
  const filteredSubmissions = useMemo(() => {
    return submissionsWithStatus.filter(submission => {
      // Status filter
      if (filters.status && submission.status !== filters.status) {
        return false
      }

      // Subject filter
      if (filters.subject && submission.data.subject !== filters.subject) {
        return false
      }

      // Search filter (name, email, subject, form name)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesName = submission.data.name.toLowerCase().includes(searchLower)
        const matchesEmail = submission.data.email.toLowerCase().includes(searchLower)
        const matchesSubject = submission.data.subject?.toLowerCase().includes(searchLower) || false
        const matchesFormName = submission.form_name.toLowerCase().includes(searchLower)
        
        if (!matchesName && !matchesEmail && !matchesSubject && !matchesFormName) {
          return false
        }
      }

      // Date filters
      if (filters.dateFrom) {
        const submissionDate = new Date(submission.submitted_at)
        const fromDate = new Date(filters.dateFrom)
        if (submissionDate < fromDate) {
          return false
        }
      }

      if (filters.dateTo) {
        const submissionDate = new Date(submission.submitted_at)
        const toDate = new Date(filters.dateTo)
        if (submissionDate > toDate) {
          return false
        }
      }

      return true
    })
  }, [submissionsWithStatus, filters])

  // Pagination
  const totalPages = Math.ceil(filteredSubmissions.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedSubmissions = filteredSubmissions.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const paginationInfo: PaginationInfo = {
    currentPage,
    totalPages,
    totalItems: filteredSubmissions.length,
    itemsPerPage: ITEMS_PER_PAGE
  }

  // Download CSV function
  const downloadCSV = () => {
    const headers = ['ID', 'Form Name', 'Name', 'Email', 'Subject', 'Status', 'Date']
    const csvContent = [
      headers.join(','),
      ...filteredSubmissions.map(submission => [
        submission.id,
        `"${submission.form_name}"`,
        `"${submission.data.name}"`,
        submission.data.email,
        `"${submission.data.subject || ''}"`,
        submission.status,
        new Date(submission.submitted_at).toLocaleDateString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `form-submissions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
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

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Form Submissions</h1>
                <p className="text-gray-600 mt-2">Manage and review Contact Form 7 submissions</p>
              </div>
              <button
                onClick={downloadCSV}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download CSV
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Submissions
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    placeholder="Search by name, email..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                  <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  <option value="">All Statuses</option>
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  value={filters.subject}
                  onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  <option value="">All Subjects</option>
                  {uniqueSubjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  id="dateFrom"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  id="dateTo"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
            </div>

            {/* Clear filters button */}
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => {
                  setFilters({ status: '', search: '', dateFrom: '', dateTo: '', subject: '' })
                  setCurrentPage(1)
                }}
                className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
              >
                Clear all filters
              </button>
              
              {/* Results info */}
              <span className="text-sm text-gray-600">
                {filteredSubmissions.length} {filteredSubmissions.length === 1 ? 'submission' : 'submissions'} found
              </span>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Submissions ({filteredSubmissions.length})
                </h3>
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredSubmissions.length)} of {filteredSubmissions.length} submissions
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Form
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link 
                          href={`/dashboard/form-submissions/${submission.id}`}
                          className="text-green-600 hover:text-green-900 font-medium transition-colors"
                        >
                          {submission.form_name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{submission.data.name}</div>
                          <div className="text-sm text-gray-500">{submission.data.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="max-w-xs truncate">
                          {submission.data.subject || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(submission.submitted_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(submission.status)}`}>
                          {submission.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty state */}
            {filteredSubmissions.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            page === currentPage
                              ? 'bg-green-600 text-white'
                              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 