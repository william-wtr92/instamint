import { z } from "zod"

export const userEmailValidationSchema = z.object({
  validation: z.string().nullable(),
})

export const userResendEmailValidationSchema = z.object({
  email: z.string().email(),
})

export type UserEmailToken = z.infer<typeof userEmailValidationSchema>
export type UserResendEmail = z.infer<typeof userResendEmailValidationSchema>
