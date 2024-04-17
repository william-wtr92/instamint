import { z } from "zod"

export const userInfosSchema = z.object({
  username: z
    .string()
    .regex(
      new RegExp("^[a-zA-Z0-9]+$"),
      "The user name can contain only lower case letters, upper case letters and numbers !"
    )
    .min(3, "The user name must be at least 3 characters long !")
    .max(20, "The user name must be at most 20 characters long !")
    .optional(),
  email: z.string().email({
    message: "Invalid email address",
  }),
  bio: z
    .string()
    .max(50, "The bio must be at most 50 characters long !")
    .optional()
    .nullable(),
  link: z.string().url().optional().nullable(),
})

export type UserInfosSchema = z.infer<typeof userInfosSchema>
