import { env } from "@/env"

export const config = {
  api: {
    baseUrl: env.server.NEXT_PUBLIC_BASE_URL,
  },
}
