"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { RotateCcw, ExternalLink, Loader2, Image, Bug, Logs } from "lucide-react"
import type { FormattedBotData } from "@/components/logs-table/types"
import { RECORDING_VIEWER_URL } from "@/lib/external-urls"
import { retryWebhook, fetchScreenshots } from "@/lib/api"
import { toast } from "sonner"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useScreenshotViewer } from "@/hooks/use-screenshot-viewer"
import { ReportErrorDialog } from "@/components/logs-table/report-error-dialog"
import { useSession } from "@/hooks/use-session"

const iconClasses = "size-4"

interface IconButtonProps {
  icon: React.ReactNode
  tooltip: string
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  children?: React.ReactNode
}

function IconButton({ icon, tooltip, onClick, disabled, loading, children }: IconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-8"
          aria-label={loading ? "Loading..." : tooltip}
          onClick={onClick}
          disabled={disabled || loading}
        >
          {loading ? <Loader2 className={cn(iconClasses, "animate-spin stroke-primary")} /> : icon}
          {children}
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
  containerClassName?: string
}

export function TableActions({ row, containerClassName }: TableActionsProps) {
  const [resendLoading, setResendLoading] = useState(false)
  const [screenshotsLoading, setScreenshotsLoading] = useState(false)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const { openViewer } = useScreenshotViewer()
  const session = useSession()

  const isMeetingBaasUser = session?.user?.email?.endsWith("@meetingbaas.com")

  const handleViewRecording = () => {
    const url = RECORDING_VIEWER_URL.replace(":uuid", row.uuid)
    window.open(url, "_blank")
  }

  const handleRetry = async () => {
    if (resendLoading) {
      return
    }

    if (!row.ended_at) {
      toast.error("The meeting hasn't ended yet")
      return
    }

    try {
      setResendLoading(true)
      await retryWebhook(row.uuid)
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
      const fetchedScreenshots = await fetchScreenshots(row.uuid, session?.user.botsApiKey || "")
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

  const handleViewGrafanaLogs = () => {
    const url = `https://meetingbaas.grafana.net/explore?schemaVersion=1&panes=%7B%225lu%22:%7B%22datasource%22:%22grafanacloud-logs%22,%22queries%22:%5B%7B%22refId%22:%22A%22,%22expr%22:%22%7Bbot_uuid%3D%5C%22${row.uuid}%5C%22%7D+%7C%3D+%60%60%22,%22queryType%22:%22range%22,%22datasource%22:%7B%22type%22:%22loki%22,%22uid%22:%22grafanacloud-logs%22%7D,%22editorMode%22:%22builder%22,%22direction%22:%22backward%22%7D%5D,%22range%22:%7B%22from%22:%22now-2d%22,%22to%22:%22now%22%7D%7D%7D&orgId=1`
    window.open(url, "_blank")
  }

  return (
    <>
      <div className={cn("flex w-full justify-between gap-2", containerClassName)}>
        {isMeetingBaasUser && (
          <IconButton
            icon={<Logs className={iconClasses} />}
            tooltip="View Grafana logs"
            onClick={handleViewGrafanaLogs}
          />
        )}
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
          icon={<Bug className={iconClasses} />}
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
        bot_uuid={row.uuid}
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
      />
    </>
  )
}
