export type PlatformName = "zoom" | "teams" | "google meet" | "unknown"
export type StatusType = "success" | "error" | "pending" | "warning"

export type UserReportedErrorMessage = {
  created_at: string
  author: string
  note: string
}

export type UserReportedError = {
  status: "open" | "closed" | "in progress"
  messages: UserReportedErrorMessage[]
}

export type Bot = {
  id: number
  account_id: number
  meeting_url: string
  created_at: string
  session_id: string | null
  reserved: boolean
  errors: string | null
  ended_at: string | null
  uuid: string
  user_reported_error: UserReportedError | null
}

export type BotParams = {
  webhook_url: string | null
  extra: Record<string, unknown> | null
  bot_name: string | null
}

export type BotData = {
  bot: Bot
  params: BotParams
  duration: number
}

export type BotPaginated = {
  has_more: boolean
  bots: BotData[]
}

export type BotStatus = {
  text: string
  type: StatusType
  details?: string | null
}

export type FormattedBotData = BotData & {
  formattedStatus: BotStatus
  platform: PlatformName
}

export type FormattedBotPaginated = {
  has_more: boolean
  bots: FormattedBotData[]
}

export type Screenshot = {
  url: string
  date: string
}
