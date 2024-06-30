import { z } from "zod"

export const searchSchema = z.object({
  query: z.string().min(3).max(100),
  limit: z.string().default("50"),
  offset: z.string().default("0"),
})

export type Search = z.infer<typeof searchSchema>
