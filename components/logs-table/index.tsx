"use client"

import { useState, useEffect, useMemo } from "react"
import { DataTable } from "@/components/logs-table/data-table"
import { createColumns } from "@/components/logs-table/columns"
import { Loader2 } from "lucide-react"
import { useLogs } from "@/hooks/use-logs"
import type { DateValueType } from "react-tailwindcss-datepicker/dist/types"
import { PAGE_SIZE_STORAGE_KEY, pageSizeOptions } from "@/components/logs-table/page-size-selector"
import type { FilterState } from "@/components/logs-table/types"
import { useSearchParams, useRouter } from "next/navigation"
import {
  validateDateRange,
  validateFilterValues,
  validateBotUuids,
  updateSearchParams
} from "@/lib/search-params"
import { useSession } from "@/hooks/use-session"
import { isMeetingBaasUser } from "@/lib/utils"

export const DEFAULT_PAGE_SIZE = pageSizeOptions[0].value

export default function LogsTable() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const session = useSession()
  const email = session?.user.email
  const columns = useMemo(() => createColumns(email), [email])
  const meetingBaasUser = isMeetingBaasUser(email)

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
      searchParams.get("userReportedErrorStatusFilters"),
      searchParams.get("userEmailFilter")
    )
  )

  // Initialize bot UUIDs from URL params
  const [botUuids, setBotUuids] = useState<string[]>(() =>
    validateBotUuids(searchParams.get("bot_uuid"))
  )

  // Update URL when date range, filters, or bot UUIDs change
  useEffect(() => {
    const newParams = updateSearchParams(searchParams, dateRange, filters, botUuids)
    if (newParams.toString() !== searchParams.toString()) {
      router.replace(`?${newParams.toString()}`, { scroll: false })
    }
  }, [dateRange, filters, botUuids, router, searchParams])

  const { data, isLoading, isRefetching } = useLogs({
    offset: pageIndex * pageSize,
    pageSize,
    startDate: dateRange?.startDate ?? null,
    endDate: dateRange?.endDate ?? null,
    filters,
    botUuids
  })

  return (
    <div className="relative">
      {/* Loading state - only show full screen loader on initial load */}
      {isLoading && !data ? (
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
          botUuids={botUuids}
          setBotUuids={setBotUuids}
          isMeetingBaasUser={meetingBaasUser}
        />
      )}
    </div>
  )
}
