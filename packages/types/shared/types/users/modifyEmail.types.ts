import { z } from "zod"

export const modifyEmailSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
    newMail: z.string().email(),
  })
  .refine((data) => data.email != data.newMail, {
    message: "Emails cant match",
    path: ["newMail"],
  })

export type ModifyEmail = z.infer<typeof modifyEmailSchema>
