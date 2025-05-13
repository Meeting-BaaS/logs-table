import type { BotPaginated, Screenshot } from "@/components/logs-table/types"
import type { BotQueryParams, BotSearchServerFormData } from "@/lib/schemas/bot-search"

export async function fetchLogs(
  params: BotQueryParams | BotSearchServerFormData
): Promise<BotPaginated> {
  const queryParams =
    "bot_uuid" in params
      ? new URLSearchParams({
          bot_uuid: params.bot_uuid ?? "",
          offset: params.offset.toString(),
          limit: params.limit.toString()
        })
      : new URLSearchParams({
          offset: params.offset.toString(),
          limit: params.limit.toString(),
          start_date: params.start_date,
          end_date: params.end_date
        })

  const response = await fetch(`/api/logs?${queryParams.toString()}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch logs: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function retryWebhook(bot_uuid: string): Promise<void> {
  const response = await fetch(`/api/retry-webhook?bot_uuid=${bot_uuid}`, {
    method: "POST"
  })

  if (!response.ok) {
    throw new Error(`Failed to resend webhook: ${response.status} ${response.statusText}`)
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

export async function fetchScreenshots(bot_uuid: string): Promise<Screenshot[]> {
  const response = await fetch(`/api/screenshots?bot_uuid=${bot_uuid}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch screenshots: ${response.status} ${response.statusText}`)
  }

  return response.json()
}
