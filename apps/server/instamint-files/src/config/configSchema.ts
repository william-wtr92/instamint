import { z } from "zod"

export const configSchema = z
  .object({
    port: z.number(),
    cors: z.object({
      origin: z.string(),
    }),
    azure: z.object({
      accountName: z.string(),
      accountKey: z.string(),
      blob: z.object({
        connection: z.string(),
        container: z.string(),
      }),
    }),
  })
  .strict()

export type Config = z.infer<typeof configSchema>
