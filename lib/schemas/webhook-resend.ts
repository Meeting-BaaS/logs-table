import { z } from "zod"
import isURL from "validator/lib/isURL"

export const webhookResendSchema = z.object({
  webhookUrl: z
    .string()
    .trim()
    .optional()
    .refine(
      (url) => (!url ? true : isURL(url, { require_protocol: true })),
      "Please enter a valid URL"
    )
    .refine((url) => (!url ? true : url.length <= 2048), "URL is too long")
})

export type WebhookResendFormData = z.infer<typeof webhookResendSchema>
