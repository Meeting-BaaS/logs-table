import type {
  BotPaginated,
  BotQueryParams,
  Screenshot,
  BotSearchParams,
  UserReportedError
} from "@/components/logs-table/types"

export async function fetchLogs(params: BotQueryParams | BotSearchParams): Promise<BotPaginated> {
  const queryParams =
    "bot_uuid" in params
      ? new URLSearchParams({
          bot_uuid: params.bot_uuid,
          offset: params.offset.toString(),
          limit: params.limit.toString()
        })
      : new URLSearchParams({
          offset: params.offset.toString(),
          limit: params.limit.toString(),
          start_date: params.start_date,
          end_date: params.end_date
        })

  const response = await fetch(`/api/bots/all?${queryParams.toString()}`, {
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch logs: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function retryWebhook(bot_uuid: string): Promise<void> {
  const response = await fetch(`/api/bots/retry_webhook?bot_uuid=${bot_uuid}`, {
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
      "x-meeting-baas-api-key": bots_api_key,
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch screenshots: ${response.status} ${response.statusText}`)
  }

  return response.json()
}
