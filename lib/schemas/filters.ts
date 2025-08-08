import { z } from "zod"

export const filtersSchema = z.object({
  platformFilters: z.array(z.string()).optional(),
  statusFilters: z.array(z.string()).optional(),
  userReportedErrorStatusFilters: z.array(z.string()).optional(),
  userEmailFilter: z.string().optional()
})

export type FiltersFormData = z.infer<typeof filtersSchema>
