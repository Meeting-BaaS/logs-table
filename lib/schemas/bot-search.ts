import { z } from "zod"

export const botSearchSchema = z.object({
  bot_uuid: z
    .string()
    .trim()
    .min(1, "Please enter a bot UUID")
    .uuid("Please enter a valid bot UUID")
})

const offsetSchema = z.number().min(0).default(0)
const limitSchema = z.number().min(1)

export const botSearchServerSchema = botSearchSchema.extend({
  offset: offsetSchema,
  limit: limitSchema
})

export const botQueryParamsSchema = z.object({
  offset: offsetSchema,
  limit: limitSchema,
  // Start date and end date are expected to be in the format YYYY-MM-DDTHH:MM:SS
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$|^$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$|^$/)
})

export type BotSearchFormData = z.infer<typeof botSearchSchema>
export type BotSearchServerFormData = z.infer<typeof botSearchServerSchema>
export type BotQueryParams = z.infer<typeof botQueryParamsSchema>
