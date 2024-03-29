import { z } from "zod"

// eslint-disable-next-line no-warning-comments
// TODO: In future, you will have to delete and put these types or validation schema in packages/types/shared/.
export const idSchema = z.object({ id: z.string() })

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type UserId = z.infer<typeof idSchema>
export type UserLogin = z.infer<typeof loginSchema>
