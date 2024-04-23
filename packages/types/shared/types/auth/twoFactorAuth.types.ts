import { z } from "zod"

export const activateTwoFactorAuthSchema = z.object({
  code: z.string().min(6).max(6),
})

export type ActivateTwoFactorAuth = z.infer<typeof activateTwoFactorAuthSchema>
