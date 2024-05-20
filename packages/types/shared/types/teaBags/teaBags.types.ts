import { z } from "zod"

export const createTeaBagsSchema = z.object({
  name: z.string(),
  bio: z.string(),
  link: z.string(),
})

export type CreateTeaBags = z.infer<typeof createTeaBagsSchema>
