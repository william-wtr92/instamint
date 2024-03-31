import useSWR, { type SWRConfiguration } from "swr"

import { routes } from "@/web/routes"
import type { ConnectedUsers } from "@/types"

export const useUser = () => {
  const config: SWRConfiguration = {
    revalidateOnFocus: false,
    refreshInterval: 60000,
    revalidateOnReconnect: true,
  }

  const { ...query } = useSWR<ConnectedUsers, Error>(routes.auth.me, config)

  return {
    ...query,
  }
}
