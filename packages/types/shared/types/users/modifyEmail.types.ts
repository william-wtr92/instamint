import { z } from "zod"

export const modifyEmailSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
    newEmail: z.string().email(),
  })
  .refine((data) => data.email != data.newEmail, {
    message: "Emails cant match",
    path: ["newMail"],
  })

export type ModifyEmail = z.infer<typeof modifyEmailSchema>
