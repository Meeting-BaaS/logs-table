"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/logs-table/data-table"
import { columns } from "@/components/logs-table/columns"
import { Loader2 } from "lucide-react"
import { useLogs } from "@/hooks/use-logs"
import { genericError } from "@/lib/errors"
import type { DateValueType } from "react-tailwindcss-datepicker/dist/types"
import { PAGE_SIZE_STORAGE_KEY, pageSizeOptions } from "@/components/logs-table/page-size-selector"
import type { FilterState } from "@/components/logs-table/types"
import { useSearchParams, useRouter } from "next/navigation"
import {
  validateDateRange,
  validateFilterValues,
  filterStateToSearchValues,
  dateToUtcString
} from "@/lib/search-params"

export const DEFAULT_PAGE_SIZE = pageSizeOptions[0].value

export default function LogsTable() {
  const router = useRouter()
  const searchParams = useSearchParams()

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

  // Initialize date range from URL params or default to last 14 days
  const [dateRange, setDateRange] = useState<DateValueType>(() =>
    validateDateRange(searchParams.get("startDate"), searchParams.get("endDate"))
  )

  // Initialize filters from URL params or empty arrays
  const [filters, setFilters] = useState<FilterState>(() =>
    validateFilterValues(
      searchParams.get("platformFilters"),
      searchParams.get("statusFilters"),
      searchParams.get("userReportedErrorStatusFilters")
    )
  )

  // Update URL when date range or filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    const startDateUtc = dateToUtcString(dateRange?.startDate ?? null)
    if (startDateUtc) {
      params.set("startDate", startDateUtc)
    } else {
      params.delete("startDate")
    }

    const endDateUtc = dateToUtcString(dateRange?.endDate ?? null)
    if (endDateUtc) {
      params.set("endDate", endDateUtc)
    } else {
      params.delete("endDate")
    }

    const searchValues = filterStateToSearchValues(filters)

    if (searchValues.platformFilters.length > 0) {
      params.set("platformFilters", searchValues.platformFilters.join(","))
    } else {
      params.delete("platformFilters")
    }

    if (searchValues.statusFilters.length > 0) {
      params.set("statusFilters", searchValues.statusFilters.join(","))
    } else {
      params.delete("statusFilters")
    }

    if (searchValues.userReportedErrorStatusFilters.length > 0) {
      params.set(
        "userReportedErrorStatusFilters",
        searchValues.userReportedErrorStatusFilters.join(",")
      )
    } else {
      params.delete("userReportedErrorStatusFilters")
    }

    // Update URL without triggering a page reload
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [dateRange, filters, router, searchParams])

  const { data, isLoading, isError, error, isRefetching } = useLogs({
    offset: pageIndex * pageSize,
    pageSize,
    startDate: dateRange?.startDate ?? null,
    endDate: dateRange?.endDate ?? null,
    filters
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
        <DataTable
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
          filters={filters}
          setFilters={setFilters}
        />
      )}
    </div>
  )
}
