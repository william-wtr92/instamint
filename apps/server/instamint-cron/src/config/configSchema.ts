import { z } from "zod"

export const configSchema = z
  .object({
    baseUrl: z.string(),
    redis: z.object({
      host: z.string(),
      port: z.string(),
      password: z.string(),
    }),
    jwt: z.object({
      secret: z.string(),
      expiresIn: z.number(),
      algorithm: z.literal("HS512"),
      scopes: z.object({
        deleteAccount: z.string(),
      }),
    }),
  })
  .strict()
