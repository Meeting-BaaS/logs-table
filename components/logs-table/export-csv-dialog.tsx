"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Download } from "lucide-react"
import type { Table } from "@tanstack/react-table"
import dayjs from "dayjs"
import type { DateValueType } from "react-tailwindcss-datepicker"
import type { FormattedBotData } from "@/components/logs-table/types"
import { columns } from "@/components/logs-table/columns"
import { CSVLink } from "react-csv"

interface ColumnMeta {
  displayName: string
}

interface ExportCsvDialogProps<TData> {
  table: Table<TData>
  dateRange: DateValueType
  pageIndex: number
}

// Escape quotes in JSON string to avoid CSV parsing issues
function escapeExtraForCsv(extra: object | null): string {
  if (!extra) return ""
  const jsonString = JSON.stringify(extra)
  return jsonString.replace(/"/g, '""')
}

export function ExportCsvDialog<TData>({
  table,
  dateRange,
  pageIndex
}: ExportCsvDialogProps<TData>) {
  const headers = columns
    .filter((column) => column.id !== "actions")
    .map((column) => ({
      label: (column.meta as ColumnMeta)?.displayName ?? column.id,
      key: column.id
    })) as { label: string; key: string }[]

  const data = table.getFilteredRowModel().rows.map((row) => {
    const rowData = row.original as FormattedBotData
    return {
      created_at: rowData.bot.created_at,
      duration: rowData.duration,
      uuid: rowData.bot.uuid,
      platform: rowData.bot.meeting_url,
      bot_name: rowData.params.bot_name,
      reserved: rowData.bot.reserved,
      extra: escapeExtraForCsv(rowData.params.extra),
      status: rowData.formattedStatus.details || rowData.formattedStatus.text
    }
  })

  const startDate = dateRange?.startDate ? dayjs(dateRange.startDate).format("YYYY-MM-DD") : "start"
  const endDate = dateRange?.endDate ? dayjs(dateRange.endDate).format("YYYY-MM-DD") : "end"
  const fileName = `bots_export_${startDate}_to_${endDate}_page_${pageIndex + 1}.csv`

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Download CSV">
          <Download />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download CSV</DialogTitle>
          <DialogDescription>
            This will only export the currently shown rows. To export another set of data, navigate
            to another page.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button asChild>
              <CSVLink data={data} headers={headers} filename={fileName} className="hidden">
                <Download />
                Download
              </CSVLink>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
