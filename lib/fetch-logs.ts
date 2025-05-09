import type { BotPaginated, BotQueryParams } from "@/components/logs-table/types"
import { mockData } from "@/components/logs-table/mock-data"

const apiServerBaseUrl = process.env.NEXT_PUBLIC_API_SERVER_BASEURL

if (!apiServerBaseUrl) {
  throw new Error("NEXT_PUBLIC_API_SERVER_BASEURL environment variable is not defined")
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const fetchLogs = async (params: BotQueryParams): Promise<BotPaginated> => {
  // Simulate network latency
  await delay(500) // 0.5 second delay

  if (!params.jwt) {
    throw new Error("Access token is required")
  }

  return mockData as BotPaginated
  // const response = await fetch(
  //   `${apiServerBaseUrl}/bots/all?${new URLSearchParams({
  //     offset: params.offset.toString(),
  //     limit: params.limit.toString(),
  //     ...(params.start_date && { start_date: params.start_date }),
  //     ...(params.end_date && { end_date: params.end_date }),
  //     ...(params.bot_id && { bot_id: params.bot_id })
  //   })}`,
  //   {
  //     credentials: "include",
  //     headers: {
  //       Accept: "application/json",
  //       Authorization: params.jwt
  //     }
  //   }
  // )

  // if (!response.ok) {
  //   throw new Error(`Failed to fetch logs: ${response.status} ${response.statusText}`)
  // }

  // const data = await response.json()

  // const result = botPaginatedSchema.safeParse(data)

  // if (!result.success) {
  //   console.error("Invalid API response:", result.error)
  //   throw new Error("Invalid API response format")
  // }

  // return result.data
}
