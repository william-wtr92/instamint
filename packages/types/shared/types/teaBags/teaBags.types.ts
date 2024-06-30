import { z } from "zod"

export const createTeaBagsSchema = z.object({
  name: z.string(),
  bio: z.string(),
  link: z.string(),
})

export const getTeaBagsSchema = z.object({
  limit: z.string().default("15"),
  offset: z.string().default("0"),
})

export type CreateTeaBags = z.infer<typeof createTeaBagsSchema>

export type GetTeaBags = z.infer<typeof getTeaBagsSchema>
