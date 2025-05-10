import type { BotPaginated, BotQueryParams, Screenshot } from "@/components/logs-table/types"
import { filterAndPaginateMockData, mockScreenshots } from "@/components/logs-table/mock-data"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchLogs(params: BotQueryParams): Promise<BotPaginated> {
  // Simulate network latency
  await delay(500)

  return filterAndPaginateMockData(params)
}

export async function retryWebhook(bot_uuid: string): Promise<void> {
  // Simulate network latency
  await delay(300)

  // Simulate random success/failure for testing
  const isSuccess = Math.random() > 0.2 // 80% success rate

  if (!isSuccess) {
    throw new Error("Failed to resend webhook: 500 Internal Server Error")
  }

  return Promise.resolve()
}

export async function reportError(bot_id: number): Promise<void> {
  // Simulate network latency
  await delay(300)

  // Simulate random success/failure for testing
  const isSuccess = Math.random() > 0.1 // 90% success rate

  if (!isSuccess) {
    throw new Error("Failed to report error: 500 Internal Server Error")
  }

  return Promise.resolve()
}

export async function fetchScreenshots(botId: string): Promise<Screenshot[]> {
  // Simulate network latency
  await delay(300)

  // Simulate random success/failure for testing
  const isSuccess = Math.random() > 0.1 // 90% success rate

  if (!isSuccess) {
    throw new Error("Failed to fetch screenshots: 500 Internal Server Error")
  }

  return mockScreenshots
}
