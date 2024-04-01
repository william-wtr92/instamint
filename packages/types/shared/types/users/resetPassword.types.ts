import { z } from "zod"
import { passwordErrorMessages, passwordRegex } from "../auth/signUp.types"

export const requestResetPasswordSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
})

export const confirmResetPasswordSchema = z
  .object({
    password: z
      .string()
      .regex(
        new RegExp(passwordRegex.uppercase),
        passwordErrorMessages.uppercase
      )
      .regex(
        new RegExp(passwordRegex.lowercase),
        passwordErrorMessages.lowercase
      )
      .regex(new RegExp(passwordRegex.number), passwordErrorMessages.number)
      .regex(
        new RegExp(passwordRegex.specialCharacter),
        passwordErrorMessages.specialCharacter
      )
      .min(8, passwordErrorMessages.length),
    confirmPassword: z.string(),
    validation: z.string().nullable().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  })

export type RequestResetPassword = z.infer<typeof requestResetPasswordSchema>

export type ConfirmResetPassword = z.infer<typeof confirmResetPasswordSchema>

export type ConfirmResetPasswordValidation = Pick<
  ConfirmResetPassword,
  "validation"
>
