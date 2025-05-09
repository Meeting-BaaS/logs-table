import { useQuery } from "@tanstack/react-query"
import { useJwt } from "@/hooks/use-jwt"
import { fetchLogs } from "@/lib/fetch-logs"
import type { FormattedBotData } from "@/components/logs-table/types"
import { formatBotStatus } from "@/lib/format-logs"
import { getPlatformFromUrl } from "@/lib/format-logs"

const PAGE_SIZE = 20

export function useLogs(offset: number) {
  const jwt = useJwt()

  const { data, isLoading, isError, error, isRefetching } = useQuery({
    queryKey: ["logs", { offset, limit: PAGE_SIZE }],
    queryFn: () =>
      fetchLogs({
        offset,
        limit: PAGE_SIZE,
        jwt
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
    refetchOnMount: true
  })

  return {
    data,
    isLoading,
    isError,
    error,
    isRefetching
  }
}
