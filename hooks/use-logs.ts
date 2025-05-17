import { useQuery } from "@tanstack/react-query"
import { fetchLogs } from "@/lib/api"
import type { FilterState, FormattedBotData } from "@/components/logs-table/types"
import { getPlatformFromUrl } from "@/lib/format-logs"
import dayjs from "dayjs"

interface UseLogsParams {
  offset: number
  pageSize: number
  startDate: Date | null
  endDate: Date | null
  filters: FilterState
}

export function useLogs({ offset, pageSize, startDate, endDate, filters }: UseLogsParams) {
  const { data, isLoading, isError, error, isRefetching } = useQuery({
    queryKey: [
      "logs",
      {
        offset,
        limit: pageSize,
        startDate,
        endDate,
        filters
      }
    ],
    queryFn: () => {
      const { platformFilters, statusFilters, userReportedErrorStatusFilters } = filters
      const queryParams = {
        offset,
        limit: pageSize,
        start_date: startDate ? `${dayjs(startDate).format("YYYY-MM-DD")}T00:00:00` : "",
        end_date: endDate ? `${dayjs(endDate).format("YYYY-MM-DD")}T23:59:59` : "",
        ...(platformFilters.length && {
          meeting_url_contains: filters.platformFilters.join(",")
        }),
        ...(statusFilters.length && { status_type: statusFilters.join(",") }),
        ...(userReportedErrorStatusFilters.length && {
          user_reported_error_json: `${userReportedErrorStatusFilters.join(",")}`
        })
      }

      return fetchLogs(queryParams)
    },
    select: (data) => {
      const formattedBots: FormattedBotData[] = data.bots.map((bot) => ({
        ...bot,
        platform: getPlatformFromUrl(bot.meeting_url)
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
