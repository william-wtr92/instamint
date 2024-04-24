import useSWR, { type SWRConfiguration } from "swr"

import type { ConnectedUser } from "@/types"
import { routes } from "@/web/routes"

export const useUser = () => {
  const config: SWRConfiguration = {
    revalidateOnFocus: false,
    refreshInterval: 60000,
    revalidateOnReconnect: true,
  }

  const { data, ...query } = useSWR<ConnectedUser, Error>(
    routes.api.auth.me,
    config
  )

  return {
    data: data?.result,
    ...query,
  }
}
