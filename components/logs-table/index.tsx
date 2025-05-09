"use client"

import { useState } from "react"
import { DataTable } from "@/components/logs-table/data-table"
import { columns } from "@/components/logs-table/columns"
import { Loader2 } from "lucide-react"
import { useLogs } from "@/hooks/use-logs"
import { genericError } from "@/lib/errors"

export default function LogsTable() {
  // Pagination state
  const [pageIndex, setPageIndex] = useState(0)

  const { data, isLoading, isError, error, isRefetching } = useLogs(pageIndex)

  return (
    <div className="relative">
      {/* Refetch indicator */}
      {isRefetching && (
        <div>
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
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
          //   data={data?.bots || []}
          //   pageCount={data?.has_more ? pageIndex + 2 : pageIndex + 1}
          //   pageIndex={pageIndex}
          //   pageSize={PAGE_SIZE}
          //   onPageChange={setPageIndex}
        />
      )}
    </div>
  )
}
