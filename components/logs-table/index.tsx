"use client"

import { useState } from "react"
import { DataTable } from "@/components/logs-table/data-table"
import { columns } from "@/components/logs-table/columns"
import { Loader2 } from "lucide-react"
import { useLogs } from "@/hooks/use-logs"
import { genericError } from "@/lib/errors"
import type { DateValueType } from "react-tailwindcss-datepicker/dist/types"
import dayjs from "dayjs"
import { PAGE_SIZE_STORAGE_KEY, pageSizeOptions } from "@/components/logs-table/page-size-selector"
import type { FormattedBotData } from "@/components/logs-table/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/logs-table/date-range-picker"
import { PageSizeSelector } from "@/components/logs-table/page-size-selector"
import { allPlatforms, allStatuses } from "@/components/logs-table/column-helpers"

export const DEFAULT_PAGE_SIZE = pageSizeOptions[0].value

export default function LogsTable() {
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_PAGE_SIZE
    const stored = localStorage.getItem(PAGE_SIZE_STORAGE_KEY)
    return stored ? parseInt(stored, 10) : DEFAULT_PAGE_SIZE
  })
  const [dateRange, setDateRange] = useState<DateValueType>({
    startDate: dayjs().subtract(14, "day").toDate(),
    endDate: dayjs().toDate()
  })

  // Lift columnFilters state up from DataTable
  const [columnFilters, setColumnFilters] = useState([
    { id: "platform", value: allPlatforms },
    { id: "status", value: allStatuses }
  ])

  // Extract backend filter params from columnFilters
  // const platform = columnFilters.find(f => f.id === "platform")?.value // REMOVE
  const status = columnFilters.find(f => f.id === "status")?.value

  const { data, isLoading, isError, error, isRefetching } = useLogs({
    pageIndex,
    pageSize,
    startDate: dateRange?.startDate ?? null,
    endDate: dateRange?.endDate ?? null,
    // platform, // REMOVE
    status
  })

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setPageIndex(0) // Reset to first page when changing page size
    localStorage.setItem(PAGE_SIZE_STORAGE_KEY, newSize.toString())
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <PageSizeSelector value={pageSize} onChange={handlePageSizeChange} />
        </div>
      </div>
      {/* Remove custom filter UI here. All filters are in DataTable/AdditionalFilters. */}
      {isLoading && !data ? (
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="flex h-96 items-center justify-center text-destructive">
          Error: {error instanceof Error ? error.message : genericError}
        </div>
      ) : (
        <DataTable<FormattedBotData, unknown>
          columns={columns}
          data={data?.bots || []}
          pageCount={data?.has_more ? pageIndex + 2 : pageIndex + 1}
          pageIndex={pageIndex}
          onPageChange={setPageIndex}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          isRefetching={isRefetching}
          dateRange={dateRange}
          setDateRange={setDateRange}
          // columnFilters={columnFilters} // REMOVE
          // onColumnFiltersChange={setColumnFilters} // REMOVE
        />
      )}
    </div>
  )
}
