import { z } from "zod"

import { passwordErrorMessages, passwordRegex } from "../auth/signUp.types"

export const modifyPasswordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: z
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
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.oldPassword != data.newPassword, {
    message: "Passwords cant match",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords must match",
    path: ["confirmNewPassword"],
  })

export type ModifyPassword = z.infer<typeof modifyPasswordSchema>
