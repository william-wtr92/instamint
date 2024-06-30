import { z } from "zod"

export const followPendingSchema = z.object({
  username: z.string().min(3),
  accepted: z.boolean(),
})

export type FollowPending = z.infer<typeof followPendingSchema>
export type FollowersStatus = "pending" | "accepted" | "rejected"
