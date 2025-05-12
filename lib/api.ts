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

  const response = await fetch(`${apiServerBaseUrl}/bots/all?${queryParams.toString()}`, {
    headers: {
      Cookie: `jwt=${params.jwt}`
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch logs: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function retryWebhook(bot_uuid: string, jwt: string): Promise<void> {
  const response = await fetch(`${apiServerBaseUrl}/bots/retry_webhook?bot_uuid=${bot_uuid}`, {
    method: "POST",
    headers: {
      Cookie: `jwt=${jwt}`
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to resend webhook: ${response.status} ${response.statusText}`)
  }
}

export async function reportError(bot_uuid: number, jwt: string): Promise<void> {
  const response = await fetch(`${apiServerBaseUrl}/report_error/${bot_uuid}`, {
    method: "POST",
    headers: {
      Cookie: `jwt=${jwt}`
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to report error: ${response.status} ${response.statusText}`)
  }
}

export async function fetchScreenshots(bot_uuid: string, jwt: string): Promise<Screenshot[]> {
  const response = await fetch(`${apiServerBaseUrl}/bots/${bot_uuid}/screenshots`, {
    headers: {
      Cookie: `jwt=${jwt}`
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch screenshots: ${response.status} ${response.statusText}`)
  }

  return response.json()
}
