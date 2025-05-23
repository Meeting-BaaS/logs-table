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
import type { FilterState, FormattedBotData } from "@/components/logs-table/types"
import { createColumns } from "@/components/logs-table/columns"
import { CSVLink } from "react-csv"
import { useMemo } from "react"
import { useSession } from "@/hooks/use-session"

interface ColumnMeta {
  displayName: string
}

interface ExportCsvDialogProps<TData> {
  table: Table<TData>
  dateRange: DateValueType
  pageIndex: number
  filters: FilterState
}

// Escape quotes in JSON string to avoid CSV parsing issues
function escapeExtraForCsv(extra: object | null): string {
  if (!extra) return ""
  try {
    const jsonString = JSON.stringify(extra)
    return jsonString.replace(/"/g, '""')
  } catch (error) {
    console.error("Failed to stringify extra data for CSV export", error)
    return "[Complex object - unable to export]"
  }
}

// These columns are not exported to the CSV
const columnsNotToExport = ["actions", "checkboxes"]

export function ExportCsvDialog<TData extends FormattedBotData>({
  table,
  dateRange,
  pageIndex,
  filters
}: ExportCsvDialogProps<TData>) {
  const session = useSession()
  const email = session?.user.email
  const columns = useMemo(() => createColumns(email), [email])

  const headers = columns
    .filter((column) => !columnsNotToExport.includes(column.id ?? ""))
    .map((column) => ({
      label: (column.meta as ColumnMeta)?.displayName ?? column.id,
      key: column.id
    })) as { label: string; key: string }[]

  const data = table.getFilteredRowModel().rows.map((row) => {
    const rowData = row.original as FormattedBotData
    return {
      created_at: rowData.created_at,
      duration: rowData.duration,
      uuid: rowData.uuid,
      platform: rowData.meeting_url,
      bot_name: rowData.params.bot_name,
      reserved: rowData.reserved,
      extra: escapeExtraForCsv(rowData.params.extra),
      account_email: rowData.account_email || "-",
      status: rowData.status.details || rowData.status.value
    }
  })

  const isFiltered = useMemo(() => Object.values(filters).some((arr) => arr.length > 0), [filters])

  const startDate = dateRange?.startDate ? dayjs(dateRange.startDate).format("YYYY-MM-DD") : "start"
  const endDate = dateRange?.endDate ? dayjs(dateRange.endDate).format("YYYY-MM-DD") : "end"

  const fileName = useMemo(
    () =>
      `bots_export_${startDate}_to_${endDate}_page_${pageIndex + 1}${
        isFiltered ? "_filtered" : ""
      }.csv`,
    [startDate, endDate, pageIndex, isFiltered]
  )

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
            to another page or adjust the {isFiltered ? "filters" : "date range"}.
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
