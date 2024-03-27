import { z } from "zod"

const passwordErrorMessages = {
  uppercase: "One uppercase character",
  lowercase: "One lowercase character",
  number: "One number",
  specialCharacter: "One special character",
  length: "Must be at least 8 characters in length",
} as const

export const passwordRegex = {
  uppercase: ".*[A-Z].*",
  lowercase: ".*[a-z].*",
  number: ".*\\d.*",
  specialCharacter: ".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*",
} as const

export const baseSignupSchema = z.object({
  username: z
    .string()
    .regex(
      new RegExp("^[a-zA-Z0-9]+$"),
      "The user name can contain only lower case letters, upper case letters and numbers !"
    ),
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z
    .string()
    .regex(new RegExp(passwordRegex.uppercase), passwordErrorMessages.uppercase)
    .regex(new RegExp(passwordRegex.lowercase), passwordErrorMessages.lowercase)
    .regex(new RegExp(passwordRegex.number), passwordErrorMessages.number)
    .regex(
      new RegExp(passwordRegex.specialCharacter),
      passwordErrorMessages.specialCharacter
    )
    .min(8, passwordErrorMessages.length),
  gdprValidation: z.boolean(),
})

export const signUpSchema = baseSignupSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  })

export type BaseSignUp = z.infer<typeof baseSignupSchema>
export type SignUp = z.infer<typeof signUpSchema>
