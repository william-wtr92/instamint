import { z } from "zod"

export const idSchema = z.object({ id: z.string() })

export const userSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
    .regex(new RegExp(".*[a-z].*"), "One lowercase character")
    .regex(new RegExp(".*\\d.*"), "One number")
    .regex(
      new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
      "One special character",
    )
    .min(8, "Must be at least 8 characters in length"),
  firstname: z.string(),
  lastname: z.string(),
  roleId: z.string(),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type User = z.infer<typeof userSchema>
export type UserId = z.infer<typeof idSchema>
export type UserLogin = z.infer<typeof loginSchema>
