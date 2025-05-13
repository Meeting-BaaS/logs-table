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
import { cn } from "@/lib/utils"
import { AdditionalFilters } from "@/components/logs-table/additional-filters"
import { Loader2 } from "lucide-react"
import type { DateValueType } from "react-tailwindcss-datepicker"
import { DateRangeFilter } from "./date-range-filter"
import { ExportCsvDialog } from "./export-csv-dialog"
import { PageSizeSelector } from "@/components/logs-table/page-size-selector"
import Link from "next/link"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  pageIndex: number
  pageSize: number
  onPageChange: (pageIndex: number) => void
  onPageSizeChange: (pageSize: number) => void
  isRefetching: boolean
  dateRange: DateValueType
  setDateRange: (dateRange: DateValueType) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isRefetching,
  dateRange,
  setDateRange
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
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex w-full items-center gap-2 md:w-1/2">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
          {isRefetching && (
            <Loader2 className="size-4 animate-spin text-primary" aria-label="Refreshing logs" />
          )}
        </div>
        <div className="flex w-full items-center gap-2 md:w-1/2 lg:w-1/3 xl:w-1/4">
          <DataTableFilter globalFilter={globalFilter} onGlobalFilterChange={setGlobalFilter} />
          <ExportCsvDialog table={table} dateRange={dateRange} pageIndex={pageIndex} />
          <ColumnVisibilityDropdown table={table} />
        </div>
      </div>
      <div className="mt-2 mb-4 flex">
        <Button variant="link" asChild className="h-auto p-0 text-muted-foreground text-sm">
          <Link href="/search">Can't find what you're looking for? Search by bot UUID</Link>
        </Button>
      </div>
      <AdditionalFilters table={table} />
      <div>
        <Table className={cn(isRefetching && "animate-pulse")}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-accent dark:bg-baas-primary-700">
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        index === 0 && "rounded-tl-md",
                        index === headerGroup.headers.length - 1 && "rounded-tr-md"
                      )}
                    >
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
                  No logs found. Please try a different date range or filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="my-4 flex w-full flex-col items-center justify-between gap-2 md:w-auto md:flex-row">
        <PageSizeSelector value={pageSize} onChange={onPageSizeChange} />
        <div className="flex w-full items-center gap-2 md:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pageIndex - 1)}
            className="w-1/2 md:w-auto"
            disabled={pageIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={pageIndex >= pageCount - 1}
            className="w-1/2 md:w-auto"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
