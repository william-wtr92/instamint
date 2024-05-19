import { z } from "zod"

export const userIdAdminAction = z.object({
  id: z.string(),
})

export type UserIdAdminAction = z.infer<typeof userIdAdminAction>
