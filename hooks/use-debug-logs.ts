import { useQuery } from "@tanstack/react-query"
import { fetchDebugLogs } from "@/lib/api"
import AnsiToHtml from "ansi-to-html"
import DOMPurify from "dompurify"

const converter = new AnsiToHtml({
  newline: true
})

interface UseDebugLogsParams {
  bot_uuid: string | undefined
}

interface DebugLogsResponse {
  text: string
  logsUrl: string
  html?: string
}

export function useDebugLogs({ bot_uuid }: UseDebugLogsParams) {
  const { data, isLoading, isError, error, isRefetching } = useQuery<DebugLogsResponse>({
    queryKey: [
      "debug-logs",
      {
        bot_uuid
      }
    ],
    queryFn: () => fetchDebugLogs(bot_uuid || ""),
    select: (data) => {
      const ansiHtml = converter.toHtml(data.text)
      const cleanHtml = DOMPurify.sanitize(ansiHtml)
      return { ...data, html: cleanHtml }
    },
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
