import { useQuery } from "@tanstack/react-query"
import { useJwt } from "@/hooks/use-jwt"
import { fetchLogs } from "@/lib/fetch-logs"
import type { FormattedBotData } from "@/components/logs-table/types"
import { formatBotStatus } from "@/lib/format-logs"
import { getPlatformFromUrl } from "@/lib/format-logs"
import dayjs from "dayjs"

export const PAGE_SIZE = 10

interface UseLogsParams {
  offset: number
  startDate?: Date | null
  endDate?: Date | null
}

export function useLogs({ offset, startDate, endDate }: UseLogsParams) {
  const jwt = useJwt()

  const { data, isLoading, isError, error, isRefetching } = useQuery({
    queryKey: ["logs", { offset, limit: PAGE_SIZE, startDate, endDate }],
    queryFn: () =>
      fetchLogs({
        offset,
        limit: PAGE_SIZE,
        jwt,
        start_date: startDate ? `${dayjs(startDate).format("YYYY-MM-DD")}T00:00:00` : undefined,
        end_date: endDate ? `${dayjs(endDate).format("YYYY-MM-DD")}T23:59:59` : undefined
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
