import { z } from "zod"

export const visibilitySchema = z.object({
  isPrivate: z.boolean(),
})

export type Visibility = z.infer<typeof visibilitySchema>
