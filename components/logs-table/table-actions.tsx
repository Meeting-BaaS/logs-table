"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { RotateCcw, ExternalLink, AlertCircle, Loader2, Image } from "lucide-react"
import type { FormattedBotData } from "@/components/logs-table/types"
import { RECORDING_VIEWER_URL } from "@/lib/external-urls"
import { retryWebhook, fetchScreenshots } from "@/lib/api"
import { toast } from "sonner"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useScreenshotViewer } from "@/hooks/use-screenshot-viewer"
import { ReportErrorDialog } from "./report-error-dialog"

const iconClasses = "size-4"

interface IconButtonProps {
  icon: React.ReactNode
  tooltip: string
  onClick: () => void
  disabled?: boolean
  loading?: boolean
}

function IconButton({ icon, tooltip, onClick, disabled, loading }: IconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label={loading ? "Loading..." : tooltip}
          onClick={onClick}
          disabled={disabled || loading}
        >
          {loading ? <Loader2 className={cn(iconClasses, "animate-spin stroke-primary")} /> : icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}

interface TableActionsProps {
  row: FormattedBotData
  className?: string
}

export function TableActions({ row, className }: TableActionsProps) {
  const [resendLoading, setResendLoading] = useState(false)
  const [screenshotsLoading, setScreenshotsLoading] = useState(false)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const { openViewer } = useScreenshotViewer()

  const handleViewRecording = () => {
    const url = RECORDING_VIEWER_URL.replace(":uuid", row.bot.uuid)
    window.open(url, "_blank")
  }

  const handleRetry = async () => {
    if (resendLoading) {
      return
    }

    if (!row.bot.ended_at) {
      toast.error("The meeting hasn't ended yet")
      return
    }

    try {
      setResendLoading(true)
      await retryWebhook(row.bot.uuid)
      toast.success("Retry successful")
    } catch {
      toast.error("Retry webhook failed")
    } finally {
      setResendLoading(false)
    }
  }

  const handleReportError = () => {
    setIsReportDialogOpen(true)
  }

  const handleViewScreenshots = async () => {
    if (screenshotsLoading) {
      return
    }

    setScreenshotsLoading(true)
    try {
      const fetchedScreenshots = await fetchScreenshots(row.bot.uuid)
      if (fetchedScreenshots.length === 0) {
        toast.warning("No screenshots found")
        return
      }

      openViewer(fetchedScreenshots)
    } catch {
      toast.error("Failed to fetch screenshots")
    } finally {
      setScreenshotsLoading(false)
    }
  }

  return (
    <>
      <div className={cn("flex w-full justify-between gap-2", className)}>
        <IconButton
          icon={<RotateCcw className={iconClasses} />}
          tooltip="Resend Final Webhook"
          onClick={handleRetry}
          loading={resendLoading}
        />
        <IconButton
          icon={<ExternalLink className={iconClasses} />}
          tooltip="View recording"
          onClick={handleViewRecording}
        />
        <IconButton
          icon={<AlertCircle className={iconClasses} />}
          tooltip="Report error"
          onClick={handleReportError}
        />
        <IconButton
          icon={<Image className={iconClasses} />}
          tooltip="View screenshots"
          onClick={handleViewScreenshots}
          loading={screenshotsLoading}
        />
      </div>

      <ReportErrorDialog
        bot_uuid={row.bot.uuid}
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
      />
    </>
  )
}
