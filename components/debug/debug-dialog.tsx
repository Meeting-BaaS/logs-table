"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import type { FormattedBotData } from "@/components/logs-table/types"
import { useDebugLogs } from "@/hooks/use-debug-logs"
import { Button } from "../ui/button"
import { Download, ExternalLink, Loader2 } from "lucide-react"
import { genericError } from "@/lib/errors"
import { getGrafanaLogsUrl } from "@/lib/external-urls"
import { DebugViewer } from "@/components/debug/debug-viewer"

interface DebugDialogProps {
  row: FormattedBotData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DebugDialog({ row, open, onOpenChange }: DebugDialogProps) {
  const { uuid: bot_uuid } = row || {}
  const { data, loading, error } = useDebugLogs({ bot_uuid })

  const handleViewGrafanaLogs = () => {
    const url = getGrafanaLogsUrl(bot_uuid)
    window.open(url, "_blank")
  }

  const handleDownloadLogs = () => {
    if (data?.logsUrl) {
      window.open(data.logsUrl, "_blank")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[100svh] max-w-full overflow-y-auto sm:max-h-[90svh] sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Debug Bot Logs</DialogTitle>
          <DialogDescription>Bot ID: {bot_uuid}</DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex h-96 items-center justify-center text-destructive">
            Error: {error instanceof Error ? error.message : genericError}
          </div>
        ) : data?.html ? (
          <DebugViewer html={data.html} />
        ) : (
          <div className="flex h-96 items-center justify-center">No logs found</div>
        )}
        <DialogFooter className="flex flex-col gap-2 md:flex-row md:justify-between">
          <div className="flex w-full gap-2 md:w-auto">
            <Button onClick={handleViewGrafanaLogs} variant="outline" className="grow">
              <ExternalLink />
              Go to Grafana
            </Button>
            <Button
              onClick={handleDownloadLogs}
              variant="outline"
              className="grow"
              disabled={!data?.logsUrl}
            >
              <Download />
              Download
            </Button>
          </div>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
