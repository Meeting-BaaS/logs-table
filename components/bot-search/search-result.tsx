import type { FormattedBotData } from "@/components/logs-table/types"
import { columns } from "@/components/logs-table/columns"
import { TableActions } from "@/components/logs-table/table-actions"
import { formatCreatedAt, formatDuration } from "@/components/logs-table/column-helpers"
import { StatusBadge } from "@/components/logs-table/status-badge"
import { JsonPreview } from "@/components/logs-table/json-preview"
import { cn } from "@/lib/utils"
import { useMemo } from "react"

interface ColumnMeta {
  displayName: string
}

interface TransformedData {
  [key: string]: {
    value: string | React.ReactNode
    className?: string
  }
}

export const SearchResult = ({
  searchStarted,
  isLoading,
  data
}: { searchStarted: boolean; isLoading: boolean; data: FormattedBotData | null }) => {
  if (!searchStarted || isLoading) return null

  if (!data) {
    return (
      <div className="mt-4 text-center text-muted-foreground text-sm">
        No bot found for the given UUID.
      </div>
    )
  }

  const transformedData = useMemo<TransformedData>(
    () => ({
      created_at: {
        value: formatCreatedAt(data.bot.created_at),
        className: "first-letter:capitalize"
      },
      duration: {
        value: formatDuration(data.duration)
      },
      uuid: {
        value: data.bot.uuid
      },
      platform: {
        value: data.platform,
        className: "capitalize"
      },
      bot_name: {
        value: data.params.bot_name
      },
      reserved: {
        value: data.bot.reserved ? "Yes" : "No"
      },
      extra: {
        value: <JsonPreview data={data.params.extra} />
      },
      status: {
        value: (
          <StatusBadge
            text={data.formattedStatus.text}
            type={data.formattedStatus.type}
            details={data.formattedStatus.details}
          />
        )
      },
      actions: {
        value: <TableActions row={data} className="justify-start" />
      }
    }),
    [data]
  )

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
      {columns.map((column) => {
        if (!column.id || !(column.id in transformedData)) return null
        return (
          <div key={column.id} className="flex flex-col">
            <h3 className="font-medium text-muted-foreground" id={`label-${column.id}`}>
              {(column.meta as ColumnMeta)?.displayName ?? column.id}
            </h3>
            <div
              className={cn(transformedData[column.id as keyof typeof transformedData].className)}
              aria-labelledby={`label-${column.id}`}
            >
              {transformedData[column.id as keyof typeof transformedData].value}
            </div>
          </div>
        )
      })}
    </div>
  )
}
