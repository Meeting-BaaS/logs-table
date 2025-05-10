"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { FormattedBotData, StatusType, PlatformName } from "@/components/logs-table/types"
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
    meta: { displayName: "Created At" },
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
    meta: { displayName: "Duration" },
    header: ({ column }) => <SortableHeader column={column} title="Duration" isNumber />,
    cell: ({ row }) => formatDuration(row.original.duration)
  },
  {
    id: "uuid",
    accessorKey: "bot.uuid",
    meta: { displayName: "Bot UUID" },
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
    meta: { displayName: "Platform" },
    header: ({ column }) => <SortableHeader column={column} title="Platform" />,
    cell: ({ row }) => (
      <div className="flex w-full justify-center">
        <CopyTooltip text={row.original.bot.meeting_url} copyText="Copy meeting URL">
          {formatPlatform(row.original.platform)}
        </CopyTooltip>
      </div>
    ),
    filterFn: (row, columnId, filterValue: PlatformName[]) => {
      if (!filterValue?.length) return false
      return filterValue.includes(row.getValue(columnId))
    }
  },
  {
    id: "bot_name",
    accessorKey: "params.bot_name",
    meta: { displayName: "Bot Name" },
    header: ({ column }) => <SortableHeader column={column} title="Bot Name" />,
    sortingFn: "alphanumeric"
  },
  {
    id: "reserved",
    accessorKey: "bot.reserved",
    meta: { displayName: "Reserved" },
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
    meta: { displayName: "Extra" },
    header: ({ column }) => <SortableHeader column={column} title="Extra" />,
    cell: ({ row }) => <JsonPreview data={row.original.params.extra} />
  },
  {
    id: "status",
    accessorKey: "formattedStatus.type",
    meta: { displayName: "Status" },
    header: ({ column }) => <SortableHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const { text, type, details } = row.original.formattedStatus
      return <StatusBadge text={text} type={type} details={details} />
    },
    filterFn: (row, columnId, filterValue: StatusType[]) => {
      if (!filterValue?.length) return false
      return filterValue.includes(row.getValue(columnId))
    },
    sortingFn: (rowA, rowB) => {
      const textA = rowA.original.formattedStatus.text.toLowerCase()
      const textB = rowB.original.formattedStatus.text.toLowerCase()
      return textA.localeCompare(textB)
    }
  },
  {
    id: "actions",
    meta: { displayName: "Actions" },
    header: "",
    cell: ({ row }) => <TableActions row={row.original} />
  }
]
