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

export const DEFAULT_PAGE_SIZE = pageSizeOptions[0].value

export default function LogsTable() {
  // Pagination state
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(() => {
    // Initialize from localStorage if available, otherwise use default
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(PAGE_SIZE_STORAGE_KEY)
      return stored && pageSizeOptions.some((option) => option.value === Number(stored))
        ? Number(stored)
        : DEFAULT_PAGE_SIZE
    }
    return DEFAULT_PAGE_SIZE
  })
  // Date range state - default to last 14 days
  const [dateRange, setDateRange] = useState<DateValueType>({
    startDate: dayjs().subtract(14, "day").startOf("day").toDate(),
    endDate: dayjs().endOf("day").toDate()
  })

  const { data, isLoading, isError, error, isRefetching } = useLogs({
    offset: pageIndex * pageSize,
    pageSize,
    startDate: dateRange?.startDate ?? null,
    endDate: dateRange?.endDate ?? null
  })

  return (
    <div className="relative">
      {/* Loading state - only show full screen loader on initial load */}
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
          pageSize={pageSize}
          onPageChange={setPageIndex}
          onPageSizeChange={setPageSize}
          isRefetching={isRefetching}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      )}
    </div>
  )
}
