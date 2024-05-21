import { z } from "zod"

export const envTestSchema = z
  .object({
    server: z.object({
      NEXT_PUBLIC_BLOB_URL: z.string(),
      NEXT_PUBLIC_BASE_URL: z.string(),
      NEXT_PUBLIC_AUTH_URL: z.string(),
    }),
  })
  .strict()

export type Env = z.infer<typeof envTestSchema>
