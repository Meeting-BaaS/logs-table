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
import { Download, Loader2 } from "lucide-react"
import { genericError } from "@/lib/errors"
import { getGrafanaLogsUrl } from "@/lib/external-urls"

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
      <DialogContent className="max-h-[85svh] overflow-y-auto sm:max-h-[85svh] sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">Debug Bot Logs</DialogTitle>
          <DialogDescription>Bot ID: {bot_uuid}</DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex h-96 items-center justify-center text-destructive">
            Error: {error instanceof Error ? error.message : genericError}
          </div>
        ) : (
          <div className="wrap-normal mb-2 max-h-[60svh] overflow-y-auto pr-4">
            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: The logs are sanitized */}
            <div dangerouslySetInnerHTML={{ __html: data?.html || "" }} />
          </div>
        )}
        <DialogFooter className="flex flex-col gap-2 md:flex-row md:justify-between">
          <div className="flex gap-2">
            <Button onClick={handleViewGrafanaLogs} variant="outline">
              View Grafana Logs
            </Button>
            <Button onClick={handleDownloadLogs} variant="outline">
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
