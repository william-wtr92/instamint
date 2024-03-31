import { z } from "zod"

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Enter your password"),
})

export type SignIn = z.infer<typeof signInSchema>
