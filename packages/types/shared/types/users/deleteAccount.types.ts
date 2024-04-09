import { z } from "zod"

export const deleteAccountSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const reactivateAccountSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  validation: z.string().nullable().optional(),
})

export type DeleteAccount = z.infer<typeof deleteAccountSchema>

export type ReactivateAccount = z.infer<typeof reactivateAccountSchema>
export type ReactivateAccountValidation = Pick<ReactivateAccount, "validation">
