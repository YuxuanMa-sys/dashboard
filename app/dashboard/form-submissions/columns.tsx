"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { ArrowUpDown, MoreHorizontal, Eye } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { CF7Submission } from "@/types"

interface SubmissionColumnsProps {
  onMarkAsContacted: (submissionId: string) => void
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

export const getSubmissionColumns = ({ onMarkAsContacted }: SubmissionColumnsProps): ColumnDef<CF7Submission>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40, // Explicit size for checkbox column
  },
  {
    accessorKey: "submission_id",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        ID <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <div className="w-[80px] truncate font-medium">{row.getValue("submission_id")}</div>,
    size: 100,
  },
  {
    accessorKey: "form_name",
    header: "Form",
    cell: ({ row }) => <div className="w-[120px] truncate">{row.getValue("form_name")}</div>,
    size: 140,
  },
  {
    accessorKey: "fields.your-name",
    header: "Submitter",
    cell: ({ row }) => <div className="w-[150px] truncate">{row.original.fields["your-name"] || "N/A"}</div>,
    size: 170,
  },
  {
    accessorKey: "fields.your-email",
    header: "Email",
    cell: ({ row }) => <div className="w-[180px] truncate">{row.original.fields["your-email"] || "N/A"}</div>,
    size: 200,
  },
  {
    accessorKey: "submission_date",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Date <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="w-[130px]">{new Date(row.getValue("submission_date")).toLocaleDateString("en-CA")}</div>
    ), // Using en-CA for YYYY-MM-DD format
    size: 150,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={getStatusBadgeVariant(row.getValue("status"))} className="capitalize w-[90px] text-center block">
        {row.getValue("status")}
      </Badge>
    ),
    size: 110,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const submission = row.original
      return (
        <div className="flex items-center space-x-1 justify-end">
          <Button variant="ghost" size="icon" asChild className="h-7 w-7">
            <Link href={`/dashboard/form-submissions/${submission.submission_id}`}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">View submission</span>
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-7 w-7 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/form-submissions/${submission.submission_id}`}>View details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMarkAsContacted(submission.submission_id)}>
                Mark as Contacted
              </DropdownMenuItem>
              <DropdownMenuItem>Delete Submission</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
    size: 80, // Explicit size for actions
  },
]
