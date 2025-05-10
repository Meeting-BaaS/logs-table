import type { BotPaginated, BotQueryParams } from "@/components/logs-table/types"
import { mockData } from "@/components/logs-table/mock-data"
import dayjs from "dayjs"

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

  if (mockData.bots.length === 0) {
    return {
      bots: [],
      has_more: false
    }
  }

  // Filter bots based on date range if provided
  let filteredBots = mockData.bots

  if (params.start_date || params.end_date) {
    filteredBots = mockData.bots.filter((bot) => {
      const botDate = dayjs(bot.bot.created_at)

      if (params.start_date && params.end_date) {
        const startDate = dayjs(params.start_date)
        const endDate = dayjs(params.end_date).endOf("day")
        return botDate.isAfter(startDate) && botDate.isBefore(endDate)
      }

      if (params.start_date) {
        const startDate = dayjs(params.start_date)
        return botDate.isAfter(startDate)
      }

      if (params.end_date) {
        const endDate = dayjs(params.end_date).endOf("day")
        return botDate.isBefore(endDate)
      }

      return true
    })
  }

  // Get the total number of filtered bots
  const totalBots = filteredBots.length

  // Calculate pagination
  const startIndex = params.offset
  const endIndex = Math.min(startIndex + params.limit, totalBots)

  // Get paginated bots
  const paginatedBots = filteredBots.slice(startIndex, endIndex)

  // Determine if there are more results
  const hasMore = endIndex < totalBots

  return {
    bots: paginatedBots,
    has_more: hasMore
  }

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
