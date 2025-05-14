import { useQuery } from "@tanstack/react-query"
import { fetchLogs, type FetchLogsParams } from "@/lib/api"
import type { BotPaginated, FormattedBotData, FormattedBotPaginated } from "@/components/logs-table/types"
import { formatBotStatus } from "@/lib/format-logs"
import { getPlatformFromUrl } from "@/lib/format-logs"
import dayjs from "dayjs"

export interface UseLogsParams extends Partial<Omit<FetchLogsParams, "offset" | "limit">> {
  pageIndex: number
  pageSize: number
  startDate?: Date | null
  endDate?: Date | null
}

export function useLogs({ 
  pageIndex, 
  pageSize,
  startDate,
  endDate,
  ...filters
}: UseLogsParams) {
  const offset = pageIndex * pageSize

  const { data, isLoading, isError, error, isRefetching } = useQuery<BotPaginated, Error, FormattedBotPaginated>({
    queryKey: ["logs", { 
      offset, 
      limit: pageSize,
      startDate,
      endDate,
      ...filters
    }],
    queryFn: async () => {
      const response = await fetchLogs({
        offset,
        limit: pageSize,
        start_date: startDate ? dayjs(startDate).format("YYYY-MM-DD") + "T00:00:00" : undefined,
        end_date: endDate ? dayjs(endDate).format("YYYY-MM-DD") + "T23:59:59" : undefined,
        ...filters
      })
      console.log("API Response:", JSON.stringify(response, null, 2))
      return response
    },
    select: (data) => {
      console.log("Raw bot data:", JSON.stringify(data.bots[0], null, 2))
      const transformed = {
        has_more: data.has_more,
        bots: data.bots.map((bot) => {
          console.log("Processing bot:", JSON.stringify(bot, null, 2))
          return {
            ...bot,
            formattedStatus: formatBotStatus(bot),
            platform: getPlatformFromUrl(bot.meeting_url)
          }
        })
      }
      console.log("Transformed data:", JSON.stringify(transformed.bots[0], null, 2))
      return transformed
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    placeholderData: (previousData) => previousData
  })

  return { data, isLoading, isError, error, isRefetching }
}
