import { z } from "zod"

export const searchByEmailSchema = z.object({
  searchByEmail: z.boolean(),
})

export type SearchByEmail = z.infer<typeof searchByEmailSchema>
