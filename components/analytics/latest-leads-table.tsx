"use client"

import React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import Image from "next/image"

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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { CF7Submission } from "@/types"
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel } from "@tanstack/react-table"
import { DataTablePagination } from "@/components/data-table-pagination" // Re-use existing pagination

interface LatestLeadsTableProps {
  leads: CF7Submission[]
}

// Simplified for this example, can be expanded
const getLeadStagePercentage = (status: CF7Submission["status"]): number => {
  switch (status) {
    case "New":
      return 10
    case "Contacted":
      return 30
    case "Qualified":
      return 60
    case "Converted":
      return 100
    case "In Progress":
      return 75
    case "Closed":
      return 0 // Or 100 if closed-won
    default:
      return 0
  }
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

export function LatestLeadsTable({ leads }: LatestLeadsTableProps) {
  const [rowSelection, setRowSelection] = React.useState({})

  const columns: ColumnDef<CF7Submission>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "fields.your-name",
      header: "Lead Name",
      cell: ({ row }) => {
        const name = row.original.fields["your-name"] || "N/A"
        const email = row.original.fields["your-email"] || ""
        const firstLetter = name.charAt(0).toUpperCase()
        return (
          <div className="flex items-center space-x-3">
            <Image
              src={`/placeholder.svg?height=32&width=32&text=${firstLetter}`}
              width={32}
              height={32}
              alt={name}
              className="rounded-full"
            />
            <div>
              <div className="font-medium">{name}</div>
              <div className="text-xs text-muted-foreground">{email}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "fields.company-name",
      header: "Company",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal">
          {row.original.fields["company-name"] || "N/A"}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={getStatusBadgeVariant(row.getValue("status"))} className="capitalize">
          {row.getValue("status")}
        </Badge>
      ),
    },
    {
      id: "stage",
      header: "Stage",
      cell: ({ row }) => {
        const percentage = getLeadStagePercentage(row.original.status)
        return (
          <div className="flex items-center">
            <Progress value={percentage} className="w-[100px] h-2 mr-2" />
            <span className="text-xs text-muted-foreground">{percentage}%</span>
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>View Lead</DropdownMenuItem>
              <DropdownMenuItem>Edit Lead</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: leads,
    columns,
    state: { rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } }, // Show 5 rows per page
  })

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Contact Leads</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No leads found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </CardContent>
    </Card>
  )
}
