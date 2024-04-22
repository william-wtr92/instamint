import { createApiClient } from "./createApiClient"
import { config } from "@/web/config"

const api = createApiClient({ baseURL: config.api.baseUrl })
export const globalFetcher = (url: string) =>
  api.get(url, { withCredentials: true }).then((res) => res.data)
