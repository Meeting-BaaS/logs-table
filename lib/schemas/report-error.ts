import { z } from "zod"

export const reportErrorSchema = z.object({
  note: z.string().trim().optional()
})

export const reportErrorServerSchema = reportErrorSchema.extend({
  bot_uuid: z.string().trim().uuid()
})

export type ReportErrorFormData = z.infer<typeof reportErrorSchema>
export type ReportErrorServerFormData = z.infer<typeof reportErrorServerSchema>
