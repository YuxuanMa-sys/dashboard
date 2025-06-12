import Link from "next/link"
import { ArrowLeft, FileText, User, Tag } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import cf7SubmissionsData from "@/lib/data/cf7-submissions.json"
import type { CF7Submission } from "@/types"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

async function getSubmissionDetails(submissionId: string): Promise<CF7Submission | undefined> {
  const submissions = cf7SubmissionsData as CF7Submission[]
  return submissions.find((s) => s.submission_id === submissionId)
}

export default async function SubmissionDetailPage({ params }: { params: { submissionId: string } }) {
  const submission = await getSubmissionDetails(params.submissionId)

  if (!submission) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6 text-center">
        <h2 className="text-2xl font-bold">Submission Not Found</h2>
        <p>The requested form submission could not be found.</p>
        <Button asChild>
          <Link href="/dashboard/form-submissions">Back to Submissions</Link>
        </Button>
      </div>
    )
  }

  const getStatusBadgeVariant = (status: CF7Submission["status"]) => {
    switch (status) {
      case "New":
        return "info"
      case "Contacted":
        return "default"
      case "Qualified":
        return "success"
      case "Converted":
        return "success"
      case "In Progress":
        return "warning"
      case "Closed":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/form-submissions">Form Submissions</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Submission {submission.submission_id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild className="h-7 w-7">
            <Link href="/dashboard/form-submissions">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Submission: {submission.submission_id}</h1>
          <Badge variant={getStatusBadgeVariant(submission.status)} className="ml-2 capitalize">
            {submission.status}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Submission Info</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p>
              <strong>Form:</strong> {submission.form_name} ({submission.form_id})
            </p>
            <p>
              <strong>Date:</strong> {new Date(submission.submission_date).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Submitter</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p>
              <strong>Name:</strong> {submission.fields["your-name"] || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {submission.fields["your-email"] || "N/A"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Status</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold capitalize">{submission.status}</p>
            {/* Add actions to change status if needed */}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submitted Data</CardTitle>
          <CardDescription>All fields submitted through the form.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(submission.fields).map(([key, value]) => (
            <div key={key} className="grid grid-cols-3 gap-2 items-start">
              <strong className="capitalize col-span-1">{key.replace(/-/g, " ")}:</strong>
              <p className="text-muted-foreground col-span-2">{value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
