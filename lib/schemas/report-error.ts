import { z } from "zod"

export const reportErrorSchema = z.object({
  note: z.string().trim().optional()
})

export const reportErrorServerSchema = reportErrorSchema.extend({
  bot_uuid: z.string().trim().uuid()
})

export const newMessageSchema = z.object({
  note: z.string().trim().min(1, "Message cannot be empty").max(200, "Message is too long")
})

export type ReportErrorFormData = z.infer<typeof reportErrorSchema>
export type ReportErrorServerFormData = z.infer<typeof reportErrorServerSchema>
export type NewMessageFormData = z.infer<typeof newMessageSchema>
