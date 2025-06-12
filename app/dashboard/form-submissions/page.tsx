"use client"

import * as React from "react"
import { DataTable } from "@/components/data-table"
import { useToast } from "@/components/ui/use-toast"
import initialSubmissionsData from "@/lib/data/cf7-submissions.json"
import type { CF7Submission } from "@/types"
import { getSubmissionColumns } from "./columns"
import { getItem, setItem } from "@/lib/storage"

const SUBMISSIONS_STORAGE_KEY = "duralux_submissions_data"

export default function FormSubmissionsPage() {
  const [submissionsData, setSubmissionsData] = React.useState<CF7Submission[]>(() => {
    const storedSubmissions = getItem<CF7Submission[]>(SUBMISSIONS_STORAGE_KEY)
    return storedSubmissions || (initialSubmissionsData as CF7Submission[])
  })
  const { toast } = useToast()

  React.useEffect(() => {
    setItem(SUBMISSIONS_STORAGE_KEY, submissionsData)
  }, [submissionsData])

  const handleMarkAsContacted = (submissionId: string) => {
    setSubmissionsData((prevSubmissions) =>
      prevSubmissions.map((sub) => (sub.submission_id === submissionId ? { ...sub, status: "Contacted" } : sub)),
    )
    toast({
      title: "Submission Updated",
      description: `Submission ${submissionId} marked as contacted.`,
    })
  }

  const columns = React.useMemo(
    () => getSubmissionColumns({ onMarkAsContacted: handleMarkAsContacted }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Form Submissions</h2>
          <p className="text-muted-foreground">View and manage Contact Form 7 submissions.</p>
        </div>
      </div>
      <DataTable columns={columns} data={submissionsData} filterColumnId="fields.your-email" />
    </div>
  )
}
