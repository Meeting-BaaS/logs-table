import { useQuery } from "@tanstack/react-query"
import { fetchLogs } from "@/lib/api"
import type { BotPaginated, FormattedBotData, FormattedBotPaginated } from "@/components/logs-table/types"
import { formatBotStatus } from "@/lib/format-logs"
import { getPlatformFromUrl } from "@/lib/format-logs"
import dayjs from "dayjs"

interface UseLogsParams {
  offset: number
  pageSize: number
  startDate: Date | null
  endDate: Date | null
}

export function useLogs({ offset, pageSize, startDate, endDate }: UseLogsParams) {
  const { data, isLoading, isError, error, isRefetching } = useQuery<BotPaginated, Error, FormattedBotPaginated>({
    queryKey: ["logs", { offset, limit: pageSize, startDate, endDate }],
    queryFn: async () => {
      const response = await fetchLogs({
        offset,
        limit: pageSize,
        start_date: startDate ? `${dayjs(startDate).format("YYYY-MM-DD")}T00:00:00` : "",
        end_date: endDate ? `${dayjs(endDate).format("YYYY-MM-DD")}T23:59:59` : ""
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

  return {
    data,
    isLoading,
    isError,
    error,
    isRefetching
  }
}
