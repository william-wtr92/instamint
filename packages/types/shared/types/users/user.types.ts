import { z } from "zod"

export const allSettingsSchema = z.object({
  id: z.number(),
  username: z
    .string()
    .regex(
      new RegExp("^[a-zA-Z0-9]+$"),
      "The user name can contain only lower case letters, upper case letters and numbers !"
    )
    .min(3, "The user name must be at least 3 characters long !")
    .max(20, "The user name must be at most 20 characters long !"),
  email: z.string().email({
    message: "Invalid email address",
  }),
  bio: z.string().max(50, "The bio must be at most 50 characters long !"),
  link: z.string().url(),
})

export const userIdSchema = z.object({
  id: z.number(),
})

export const usernameEmailSettingsSchema = z.object({
  id: z.number(),
  username: z
    .string()
    .regex(
      new RegExp("^[a-zA-Z0-9]+$"),
      "The user name can contain only lower case letters, upper case letters and numbers !"
    )
    .min(3, "The user name must be at least 3 characters long !")
    .max(20, "The user name must be at most 20 characters long !"),
  email: z.string().email({
    message: "Invalid email address",
  }),
})

export const bioSettingsSchema = z.object({
  id: z.number(),
  bio: z.string().max(50, "The bio must be at most 50 characters long !"),
})

export const linkSettingsSchema = z.object({
  id: z.number(),
  link: z.string().url(),
})

export type AllSettingsSchema = z.infer<typeof allSettingsSchema>
export type UserIdSchema = z.infer<typeof userIdSchema>
export type UsernameEmailSettingsSchema = z.infer<
  typeof usernameEmailSettingsSchema
>
export type BioSettingsSchema = z.infer<typeof bioSettingsSchema>
export type LinkSettingsSchema = z.infer<typeof linkSettingsSchema>
