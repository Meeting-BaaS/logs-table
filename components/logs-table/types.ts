export type PlatformName = "zoom" | "teams" | "google meet" | "unknown"
export type StatusType = "success" | "error" | "pending" | "warning"

export type UserReportedErrorMessage = {
  created_at: string
  author: string
  note: string
  chat_id?: string
  // Not received from the API, added by client to handle UI for sending messages
  id?: string
  status?: "pending" | "error" | "success"
  timezoneCorrection?: boolean
}

export type UserReportedErrorStatus = "open" | "closed" | "in_progress"

export type UserReportedError = {
  status: UserReportedErrorStatus
  messages: UserReportedErrorMessage[]
}

export type Status = {
  value: string
  type: StatusType
  details?: string | null
  sort_priority: number
  category: string
}

export type BotParams = {
  webhook_url: string | null
  extra: Record<string, unknown> | null
  bot_name: string | null
}

export type BotData = {
  id: number
  account_id: number
  account_email?: string
  meeting_url: string
  created_at: string
  session_id: string | null
  reserved: boolean
  errors: string | null
  ended_at: string | null
  uuid: string
  user_reported_error: UserReportedError | null
  params: BotParams
  duration: number
  status: Status
}

export type BotPaginated = {
  has_more: boolean
  bots: BotData[]
}

export type FormattedBotData = BotData & {
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

export type SystemMetricsMachine = {
  total_memory_mo: number
  cpu_nb_core: number
  type: string
  os_version: string
}

export type SystemMetricsPoint = {
  timestamp_ms: number
  mem_mo: number
  cpu_all: number
  cpu_ffmpeg: number
}

export type SystemMetrics = {
  machine: SystemMetricsMachine
  points: SystemMetricsPoint[]
}

export type BotSearchParams = {
  bot_uuid: string
  offset: number
  limit: number
  search: true
}

export type BotQueryParams = {
  offset: number
  limit: number
  start_date: string
  end_date: string
  meeting_url_contains?: string
  status_type?: string
  user_reported_error_json?: string
  bot_uuid?: string
  userEmail?: string
}

export type FilterState = {
  platformFilters: string[]
  statusFilters: string[]
  userReportedErrorStatusFilters: string[]
  userEmailFilter?: string
}
