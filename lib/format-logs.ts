import { getReadableError } from "@/lib/bot-error-types"
import type { BotData, BotStatus, PlatformName } from "@/components/logs-table/types"

export const formatBotStatus = (bot: BotData): BotStatus => {
  if (bot.bot.errors) {
    const { text, type } = getReadableError(bot.bot.errors)
    return { text, type, details: bot.bot.errors }
  }

  if (bot.bot.ended_at) {
    return { text: "Completed", type: "success" }
  }

  if (bot.duration > 0) {
    return { text: "In Progress", type: "success" }
  }

  return { text: "Pending", type: "pending" }
}

export const getPlatformFromUrl = (url: string): PlatformName => {
  if (url.includes("zoom.us")) return "zoom"
  if (url.includes("teams.microsoft.com")) return "teams"
  if (url.includes("meet.google.com")) return "google meet"
  return "unknown"
}
