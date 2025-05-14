import type { BotStatusResponse } from "@/components/logs-table/bot-status"

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

export interface Bot {
  account_id: number
  bot_param_id: number
  created_at: string
  diarization_v2: boolean
  duration: number
  ended_at: string | null
  errors: string | null
  event_id: number | null
  id: number
  meeting_url: string
  mp4_s3_path: string
  params: {
    bot_name: string
    extra: Record<string, any>
    webhook_url: string
    bot_image?: string | null
    deduplication_key?: string | null
    enter_message?: string | null
    noone_joined_timeout?: number | null
    recording_mode?: "speaker_view" | "gallery_view" | "audio_only" | null
    speech_to_text_api_key?: string | null
    speech_to_text_provider?: "Gladia" | "Runpod" | "Default" | null
    streaming_audio_frequency?: "16khz" | "24khz" | null
    streaming_input?: string | null
    streaming_output?: string | null
    waiting_room_timeout?: number | null
    zoom_sdk_id?: string | null
    zoom_sdk_pwd?: string | null
  }
  reserved: boolean
  scheduled_bot_id: number | null
  session_id: string | null
  status: BotStatusResponse
  transcription_fails: number | null
  user_reported_error: boolean
  uuid: string
}

export interface BotPaginedResponse {
  bots: Bot[]
  has_more: boolean
}

export type BotParams = {
  webhook_url: string | null
  extra: Record<string, unknown> | null
  bot_name: string | null
}

export type BotData = {
  id: number
  account_id: number
  meeting_url: string
  created_at: string
  session_id: string | null
  reserved: boolean
  errors: string | null
  ended_at: string | null
  mp4_s3_path: string
  uuid: string
  bot_param_id: number
  event_id: number | null
  scheduled_bot_id: number | null
  diarization_v2: boolean
  transcription_fails: number | null
  diarization_fails: number | null
  user_reported_error: UserReportedError
  params: {
    bot_name: string
    bot_image: string | null
    speech_to_text_provider: "Default" | "Gladia" | "Runpod" | null
    enter_message: string | null
    recording_mode: "speaker_view" | "gallery_view" | "audio_only" | null
    speech_to_text_api_key: string | null
    streaming_input: string | null
    streaming_output: string | null
    waiting_room_timeout: number | null
    noone_joined_timeout: number | null
    deduplication_key: string | null
    extra: Record<string, unknown>
    webhook_url: string
    streaming_audio_frequency: "16khz" | "24khz" | null
    zoom_sdk_id: string | null
    zoom_sdk_pwd: string | null
  }
  duration: number
  status: BotStatusResponse
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
