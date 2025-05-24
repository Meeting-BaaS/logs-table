import type { SystemMetrics } from "@/components/logs-table/types"
import { fetchSystemMetrics } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

interface UseSystemMetricsParams {
  bot_uuid: string | undefined
}

interface SystemMetricsResponse {
  metrics: SystemMetrics[]
  logsUrl: string
}

export function useSystemMetrics({ bot_uuid }: UseSystemMetricsParams) {
  const { data, isLoading, isError, error, isRefetching } = useQuery<SystemMetricsResponse>({
    queryKey: [
      "system-metrics",
      {
        bot_uuid
      }
    ],
    queryFn: () => fetchSystemMetrics(bot_uuid || ""),
    enabled: Boolean(bot_uuid),
    retry: false,
    refetchOnWindowFocus: false
  })

  return {
    data,
    loading: isLoading || isRefetching,
    isError,
    error
  }
} 