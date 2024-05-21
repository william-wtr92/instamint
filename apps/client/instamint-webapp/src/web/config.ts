import { env } from "@/env"

export const config = {
  api: {
    blobUrl: env.server.NEXT_PUBLIC_BLOB_URL,
    baseUrl: env.server.NEXT_PUBLIC_BASE_URL,
    authUrl: env.server.NEXT_PUBLIC_AUTH_URL,
  },
} as const
