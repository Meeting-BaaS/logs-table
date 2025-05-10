"use client"

import { useState } from "react"
import { DataTable } from "@/components/logs-table/data-table"
import { columns } from "@/components/logs-table/columns"
import { Loader2 } from "lucide-react"
import { PAGE_SIZE, useLogs } from "@/hooks/use-logs"
import { genericError } from "@/lib/errors"
import { DateRangeFilter } from "./date-range-filter"
import type { DateValueType } from "react-tailwindcss-datepicker/dist/types"
import dayjs from "dayjs"

export default function LogsTable() {
  // Pagination state
  const [pageIndex, setPageIndex] = useState(0)
  // Date range state - default to last 14 days
  const [dateRange, setDateRange] = useState<DateValueType>({
    startDate: dayjs().subtract(14, "day").startOf("day").toDate(),
    endDate: dayjs().endOf("day").toDate()
  })

  const { data, isLoading, isError, error, isRefetching } = useLogs({
    offset: pageIndex * PAGE_SIZE,
    startDate: dateRange?.startDate ?? null,
    endDate: dateRange?.endDate ?? null
  })

  return (
    <div className="relative">
      {/* Refetch indicator */}
      {isRefetching && (
        <div>
          <Loader2 className="size-4 animate-spin text-primary" />
        </div>
      )}

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
        <>
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
          <DataTable
            columns={columns}
            data={data?.bots || []}
            pageCount={data?.has_more ? pageIndex + 2 : pageIndex + 1}
            pageIndex={pageIndex}
            pageSize={PAGE_SIZE}
            onPageChange={setPageIndex}
          />
        </>
      )}
    </div>
  )
}
