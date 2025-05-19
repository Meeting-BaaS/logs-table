import type { UserReportedErrorStatus } from "@/components/logs-table/types"
import { z } from "zod"

export const statusEnum: UserReportedErrorStatus[] = ["open", "in_progress", "closed"]

export const reportErrorSchema = z.object({
  note: z.string().trim().max(200, "Note cannot be longer than 200 characters").optional()
})

export const reportErrorServerSchema = reportErrorSchema.extend({
  bot_uuid: z.string().trim().uuid()
})

export const newMessageSchema = z.object({
  note: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(2000, "Message cannot be longer than 2000 characters"),
  status: z.enum(statusEnum as [string, ...string[]])
})

export type ReportErrorFormData = z.infer<typeof reportErrorSchema>
export type ReportErrorServerFormData = z.infer<typeof reportErrorServerSchema>
export type NewMessageFormData = z.infer<typeof newMessageSchema>
