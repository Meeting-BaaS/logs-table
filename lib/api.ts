import type { BotPaginated, BotQueryParams, Screenshot } from "@/components/logs-table/types"

const apiServerBaseUrl = process.env.NEXT_PUBLIC_API_SERVER_BASEURL

if (!apiServerBaseUrl) {
  throw new Error("NEXT_PUBLIC_API_SERVER_BASEURL is not defined")
}

export async function fetchLogs(params: BotQueryParams): Promise<BotPaginated> {
  const queryParams = new URLSearchParams({
    offset: params.offset.toString(),
    limit: params.limit.toString(),
    start_date: params.start_date,
    end_date: params.end_date
  })

  const response = await fetch(`${apiServerBaseUrl}/bots?${queryParams.toString()}`, {
    credentials: "include"
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch logs: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function retryWebhook(bot_id: string): Promise<void> {
  const response = await fetch(`${apiServerBaseUrl}/bots/retry_webhook?bot_uuid=${bot_id}`, {
    method: "POST",
    credentials: "include"
  })

  if (!response.ok) {
    throw new Error(`Failed to resend webhook: ${response.status} ${response.statusText}`)
  }
}

export async function reportError(bot_id: number): Promise<void> {
  const response = await fetch(`${apiServerBaseUrl}/report_error/${bot_id}`, {
    method: "POST",
    credentials: "include"
  })

  if (!response.ok) {
    throw new Error(`Failed to report error: ${response.status} ${response.statusText}`)
  }
}

export async function fetchScreenshots(bot_id: string): Promise<Screenshot[]> {
  const response = await fetch(`${apiServerBaseUrl}/bots/${bot_id}/screenshots`, {
    credentials: "include"
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch screenshots: ${response.status} ${response.statusText}`)
  }

  return response.json()
}
