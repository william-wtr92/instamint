import { z } from "zod"

export const adminUsersAllSchema = z.object({
  limit: z.string().default("10"),
  offset: z.string().default("0"),
  filter: z.string().optional(),
})

export type AdminUsersAll = z.infer<typeof adminUsersAllSchema>
