import { z } from "zod"

export const idSchema = z.object({ id: z.string() })

export const userSchema = z.object({
  username: z
    .string()
    .regex(
      new RegExp("^[a-zA-Z0-9]+$"),
      "The user name can contain only lower case letters, upper case letters and numbers !"
    ),
  email: z.string().email(),
  password: z
    .string()
    .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
    .regex(new RegExp(".*[a-z].*"), "One lowercase character")
    .regex(new RegExp(".*\\d.*"), "One number")
    .regex(
      new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
      "One special character"
    )
    .min(8, "Must be at least 8 characters in length"),
  rgpdValidation: z.boolean(),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const userMailValidationSchema = z.object({
  token: z.string(),
})

export type User = z.infer<typeof userSchema>
export type UserId = z.infer<typeof idSchema>
export type UserLogin = z.infer<typeof loginSchema>
export type UserMailToken = z.infer<typeof userMailValidationSchema>
