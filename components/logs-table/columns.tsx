"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { FormattedBotData } from "@/components/logs-table/types"
import {
  formatCreatedAt,
  dateSort,
  formatDuration,
  formatPlatform
} from "@/components/logs-table/column-helpers"
import { SortableHeader } from "@/components/logs-table/sortable-header"
import { CopyTooltip } from "@/components/logs-table/copy-tooltip"
import { Zap } from "lucide-react"
import { TableActions } from "@/components/logs-table/table-actions"
import { JsonPreview } from "@/components/logs-table/json-preview"
import { StatusBadge } from "@/components/logs-table/status-badge"
import { cn } from "@/lib/utils"

export const columns: ColumnDef<FormattedBotData>[] = [
  {
    id: "created_at",
    accessorKey: "bot.created_at",
    header: ({ column }) => <SortableHeader column={column} title="Created At" isNumber />,
    cell: ({ row }) => (
      <CopyTooltip text={row.original.bot.created_at} copyText="Copy timestamp">
        <span>{formatCreatedAt(row.original.bot.created_at)}</span>
      </CopyTooltip>
    ),
    sortingFn: dateSort
  },
  {
    id: "duration",
    accessorKey: "duration",
    header: ({ column }) => <SortableHeader column={column} title="Duration" isNumber />,
    cell: ({ row }) => formatDuration(row.original.duration)
  },
  {
    id: "uuid",
    accessorKey: "bot.uuid",
    header: ({ column }) => <SortableHeader column={column} title="Bot UUID" />,
    cell: ({ row }) => (
      <CopyTooltip text={row.original.bot.uuid} copyText="Copy bot ID">
        {row.original.bot.uuid}
      </CopyTooltip>
    )
  },
  {
    id: "platform",
    accessorKey: "platform",
    header: ({ column }) => <SortableHeader column={column} title="Platform" />,
    cell: ({ row }) => (
      <div className="flex w-full justify-center">
        <CopyTooltip text={row.original.bot.meeting_url} copyText="Copy meeting URL">
          {formatPlatform(row.original.platform)}
        </CopyTooltip>
      </div>
    )
  },
  {
    id: "bot_name",
    accessorKey: "params.bot_name",
    header: ({ column }) => <SortableHeader column={column} title="Bot Name" />,
    sortingFn: "alphanumeric"
  },
  {
    id: "reserved",
    accessorKey: "bot.reserved",
    header: ({ column }) => <SortableHeader column={column} title="Reserved" />,
    cell: ({ row }) => (
      <div className="flex w-full justify-center text-red">
        <Zap
          className={cn(
            "size-5",
            row.original.bot.reserved ? "text-primary" : "text-primary/30 dark:text-primary/10"
          )}
        />
      </div>
    )
  },
  {
    id: "extra",
    accessorKey: "params.extra",
    header: ({ column }) => <SortableHeader column={column} title="Extra" />,
    cell: ({ row }) => <JsonPreview data={row.original.params.extra} />
  },
  {
    id: "status",
    accessorKey: "formattedStatus.text",
    header: ({ column }) => <SortableHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const { text, type, details } = row.original.formattedStatus
      return <StatusBadge text={text} type={type} details={details} />
    }
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <TableActions row={row.original} />
  }
]
