"use client"

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ColumnVisibilityDropdown } from "@/components/logs-table/column-visibility-dropdown"
import { DataTableFilter } from "@/components/logs-table/data-table-filter"
import { allPlatforms, allStatuses } from "@/components/logs-table/column-helpers"
import { CheckboxFilter } from "@/components/logs-table/checkbox-filter"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  pageIndex: number
  pageSize: number
  onPageChange: (pageIndex: number) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    {
      id: "platform",
      value: allPlatforms
    },
    {
      id: "status",
      value: allStatuses
    }
  ])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: true,
    pageCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize
      }
    }
  })

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <DataTableFilter
            table={table}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
          />
          <CheckboxFilter
            table={table}
            columnId="platform"
            options={allPlatforms}
            label="Platform"
          />
          <CheckboxFilter table={table} columnId="status" options={allStatuses} label="Status" />
        </div>
        <ColumnVisibilityDropdown table={table} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {!table.getAllColumns().some((column) => column.getIsVisible()) ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p>All columns are hidden.</p>
                    <p className="text-muted-foreground text-sm">
                      Please make some columns visible to see the logs.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pageIndex - 1)}
          disabled={pageIndex === 0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={pageIndex >= pageCount - 1}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
