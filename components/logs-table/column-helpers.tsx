import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import duration from "dayjs/plugin/duration"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import type { SortingFn } from "@tanstack/react-table"
import type { FormattedBotData, PlatformName, StatusType } from "@/components/logs-table/types"
import { ZoomLogo } from "@/components/icons/zoom"
import { MicrosoftTeamsLogo } from "@/components/icons/microsoft-teams"
import { GoogleMeetLogo } from "@/components/icons/google-meet"
import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

// Initialize dayjs plugins
dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.extend(utc)
dayjs.extend(timezone)

const iconClasses = "size-5"

export type Option = {
  label: string
  value: string
  searchParam: string
}

export const allPlatforms: Option[] = [
  { label: "Zoom", value: "zoom.us", searchParam: "zoom" },
  { label: "Google Meet", value: "meet.google.com", searchParam: "meet" },
  { label: "Teams", value: "teams.microsoft.com,teams.live.com", searchParam: "teams" }
]

export const allStatuses: Option[] = [
  { label: "Success", value: "success", searchParam: "success" },
  { label: "Error", value: "error", searchParam: "error" },
  { label: "Pending", value: "pending", searchParam: "pending" },
  { label: "Warning", value: "warning", searchParam: "warning" }
]

export const allUserReportedErrorStatuses: Option[] = [
  { label: "Open", value: JSON.stringify({ status: "open" }), searchParam: "open" },
  { label: "Closed", value: JSON.stringify({ status: "closed" }), searchParam: "closed" },
  {
    label: "In Progress",
    value: JSON.stringify({ status: "in_progress" }),
    searchParam: "in_progress"
  }
]

export const formatCreatedAt = (dateStr: string, timezoneCorrection?: boolean) => {
  // Parse the date as UTC and convert to local timezone
  const date = timezoneCorrection ? dayjs.utc(dateStr).local() : dayjs(dateStr)
  const now = dayjs()

  // If the date is more than 7 days old, show the full date
  if (now.diff(date, "day") > 7) {
    return date.format("D MMM YYYY, h:mm A")
  }

  // Otherwise show relative time
  return date.fromNow()
}

export const formatDuration = (seconds: number | null | undefined) => {
  if (!seconds) return <span className="text-muted-foreground text-xs">N/A</span>

  const dur = dayjs.duration(seconds, "seconds")

  // Format as "1h 2m 3s" or just the largest unit if others are 0
  if (dur.hours() > 0) {
    return dur.format("H[h] m[m]")
  }
  if (dur.minutes() > 0) {
    return dur.format("m[m] s[s]")
  }
  return dur.format("s[s]")
}

export const formatPlatform = (platform: PlatformName) => {
  switch (platform) {
    case "zoom":
      return <ZoomLogo className={iconClasses} />
    case "teams":
      return <MicrosoftTeamsLogo className={iconClasses} />
    case "google meet":
      return <GoogleMeetLogo className={iconClasses} />
    default:
      return <AlertTriangle className={cn(iconClasses, "text-destructive")} />
  }
}

export const dateSort: SortingFn<FormattedBotData> = (rowA, rowB, columnId) => {
  const dateA = dayjs(rowA.original.created_at)
  const dateB = dayjs(rowB.original.created_at)

  return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0
}
