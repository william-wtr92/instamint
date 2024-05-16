import { z } from "zod"

export const profileSchema = z.object({
  username: z.string().min(3),
})

export type Profile = z.infer<typeof profileSchema>
