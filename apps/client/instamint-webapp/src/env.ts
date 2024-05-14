import { type Env, envTestSchema } from "@/types"

export const env = envTestSchema.parse({
  server: {
    NEXT_PUBLIC_BLOB_URL: process.env.NEXT_PUBLIC_BLOB_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
}) satisfies Env
