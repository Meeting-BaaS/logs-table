import type {
  BotPaginated,
  BotQueryParams,
  Screenshot,
  BotSearchParams,
  UserReportedError
} from "@/components/logs-table/types"

export async function fetchLogs(params: BotQueryParams | BotSearchParams): Promise<BotPaginated> {
  const queryParams =
    "search" in params
      ? new URLSearchParams({
          bot_uuid: params.bot_uuid,
          offset: params.offset.toString(),
          limit: params.limit.toString()
        })
      : new URLSearchParams({
          offset: params.offset.toString(),
          limit: params.limit.toString(),
          start_date: params.start_date,
          end_date: params.end_date,
          ...(params.meeting_url_contains && { meeting_url_contains: params.meeting_url_contains }),
          ...(params.status_type && { status_type: params.status_type }),
          ...(params.user_reported_error_json && {
            user_reported_error_json: params.user_reported_error_json
          }),
          ...(params.bot_uuid && { bot_uuid: params.bot_uuid })
        })

  const response = await fetch(`/api/bots/all?${queryParams.toString()}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch logs: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function retryWebhook(bot_uuid: string, webhookUrl?: string): Promise<void> {
  const webhookUrlParam = webhookUrl ? `&webhook_url=${encodeURIComponent(webhookUrl)}` : ""
  const response = await fetch(`/api/bots/retry_webhook?bot_uuid=${bot_uuid}${webhookUrlParam}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to resend webhook: ${response.status} ${response.statusText}`)
  }
}

export async function updateError(
  bot_uuid: string,
  note: string,
  status?: UserReportedError["status"]
): Promise<void> {
  // Api requires the bot_uuid to be in the body and in the url
  const response = await fetch(`/api/bots/${bot_uuid}/user_reported_error`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ note, bot_uuid, ...(status && { status }) })
  })

  if (!response.ok) {
    throw new Error(`Failed to update error: ${response.status} ${response.statusText}`)
  }
}

export async function reportError(bot_uuid: string, note?: string): Promise<void> {
  const response = await fetch("/api/report-error", {
    method: "POST",
    body: JSON.stringify({ note, bot_uuid })
  })

  if (!response.ok) {
    throw new Error(`Failed to report error: ${response.status} ${response.statusText}`)
  }
}

export async function fetchScreenshots(
  bot_uuid: string,
  bots_api_key: string
): Promise<Screenshot[]> {
  const response = await fetch(`/api/bots/${bot_uuid}/screenshots`, {
    headers: {
      "x-meeting-baas-api-key": bots_api_key
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch screenshots: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function fetchDebugLogs(bot_uuid: string): Promise<{ text: string; logsUrl: string }> {
  if (!bot_uuid) return { text: "", logsUrl: "" }
  // Fetch the debug logs url
  const logsUrlResponse = await fetch(`/api/bots/${bot_uuid}/logs`)
  if (!logsUrlResponse.ok) {
    throw new Error(
      `Failed to fetch debug logs url: ${logsUrlResponse.status} ${logsUrlResponse.statusText}`
    )
  }
  const logsUrl = await logsUrlResponse.json()
  if (!logsUrl.url) {
    throw new Error("Debug logs url not found")
  }

  // Fetch the debug logs
  const response = await fetch(logsUrl.url)
  if (!response.ok) {
    throw new Error(`Failed to fetch debug logs: ${response.status} ${response.statusText}`)
  }
  const text = await response.text()
  return { text, logsUrl }
}
