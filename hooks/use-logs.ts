import { useQuery } from "@tanstack/react-query"
import { fetchLogs } from "@/lib/api"
import type { FormattedBotData } from "@/components/logs-table/types"
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
  const { data, isLoading, isError, error, isRefetching } = useQuery({
    queryKey: ["logs", { offset, limit: pageSize, startDate, endDate }],
    queryFn: () =>
      fetchLogs({
        offset,
        limit: pageSize,
        start_date: startDate ? `${dayjs(startDate).format("YYYY-MM-DD")}T00:00:00` : "",
        end_date: endDate ? `${dayjs(endDate).format("YYYY-MM-DD")}T23:59:59` : ""
      }),
    select: (data) => {
      const formattedBots: FormattedBotData[] = data.bots.map((bot) => ({
        ...bot,
        formattedStatus: formatBotStatus(bot),
        platform: getPlatformFromUrl(bot.bot.meeting_url)
      }))

      return {
        has_more: data.has_more,
        bots: formattedBots
      }
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
