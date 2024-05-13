import { z } from "zod"

export const userInfosSchema = z.object({
  username: z
    .string()
    .regex(
      new RegExp("^[a-zA-Z0-9]+$"),
      "The user name can contain only lower case letters, upper case letters and numbers!"
    )
    .min(3, "The user name must be at least 3 characters long!")
    .max(20, "The user name must be at most 20 characters long!")
    .optional(),
  bio: z
    .string()
    .max(150, "The bio must be at most 150 characters long!")
    .optional(),
  link: z
    .string()
    .max(60, "The link must be at most 60 characters long!")
    .refine((data) => data === "" || z.string().regex(new RegExp("^\/[a-zA-Z0-9\/]*$")).safeParse(data).success, {
      message: "Must be a valid link (You have to start with a / and Your link cannot contain special characters or spaces.) or empty!",
    })
    .optional(),
  location: z.string().optional(),
  avatar: z.instanceof(File).optional(),
})

export type UserInfos = z.infer<typeof userInfosSchema>
export type UserAvatar = Pick<UserInfos, "avatar">
