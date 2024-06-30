import { z } from "zod"

export const RoleSchema = z.object({
  id: z.number(),
  right: z.string(),
})

export type Role = z.infer<typeof RoleSchema>
