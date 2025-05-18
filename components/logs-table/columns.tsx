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
import type { JSX } from "react"
import { Checkbox } from "@/components/ui/checkbox"

export const columns: ColumnDef<FormattedBotData>[] = [
  {
    id: "checkboxes",
    meta: { displayName: "Checkbox" },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    )
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    meta: { displayName: "Created At" },
    header: ({ column }) => <SortableHeader column={column} title="Created At" isNumber />,
    accessorFn: (row) => formatCreatedAt(row.created_at, true),
    cell: ({ row, getValue }) => (
      <CopyTooltip
        text={row.original.created_at}
        copyText="Copy UTC timestamp"
        className="first-letter:capitalize"
      >
        <span>{getValue<string>()}</span>
      </CopyTooltip>
    ),
    sortingFn: dateSort
  },
  {
    id: "duration",
    accessorKey: "duration",
    meta: { displayName: "Duration" },
    header: ({ column }) => <SortableHeader column={column} title="Duration" isNumber />,
    accessorFn: (row) => formatDuration(row.duration),
    cell: ({ getValue }) => <span>{getValue<string | JSX.Element>()}</span>
  },
  {
    id: "uuid",
    accessorKey: "uuid",
    meta: { displayName: "Bot UUID" },
    header: ({ column }) => <SortableHeader column={column} title="Bot UUID" />,
    cell: ({ row }) => (
      <CopyTooltip text={row.original.uuid} copyText="Copy bot ID">
        {row.original.uuid}
      </CopyTooltip>
    )
  },
  {
    id: "platform",
    accessorKey: "platform",
    meta: { displayName: "Platform" },
    header: ({ column }) => <SortableHeader column={column} title="Platform" centered />,
    cell: ({ row }) => (
      <div className="flex w-full justify-center">
        <CopyTooltip text={row.original.meeting_url} copyText="Copy meeting URL">
          {formatPlatform(row.original.platform)}
        </CopyTooltip>
      </div>
    )
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
    accessorKey: "reserved",
    meta: { displayName: "Reserved" },
    header: ({ column }) => <SortableHeader column={column} title="Reserved" centered />,
    cell: ({ row }) => (
      <div className="flex w-full justify-center text-red">
        <Zap
          className={cn(
            "size-5",
            row.original.reserved ? "text-primary" : "text-primary/30 dark:text-primary/10"
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
    accessorFn: (row) => (row.params.extra ? JSON.stringify(row.params.extra) : ""),
    cell: ({ row }) => <JsonPreview data={row.original.params.extra} />
  },
  {
    id: "status",
    accessorKey: "status.type",
    accessorFn: (row) => `${row.status.type} ${row.status.value}`,
    meta: { displayName: "Status" },
    header: ({ column }) => <SortableHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const { type, details, value } = row.original.status
      return <StatusBadge text={value} type={type} details={details} />
    },
    sortingFn: (rowA, rowB) => {
      const textA = rowA.original.status.value.toLowerCase()
      const textB = rowB.original.status.value.toLowerCase()
      return textA.localeCompare(textB)
    }
  },
  {
    id: "actions",
    meta: { displayName: "Actions" },
    header: "Actions",
    cell: ({ row }) => <TableActions row={row.original} />
  }
]
