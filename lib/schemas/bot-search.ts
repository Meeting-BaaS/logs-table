import { z } from "zod"

export const botSearchSchema = z.object({
  bot_uuid: z.string().trim().min(1, "Please enter a bot UUID").uuid("Please enter a valid UUID")
})

export type BotSearchFormData = z.infer<typeof botSearchSchema>
