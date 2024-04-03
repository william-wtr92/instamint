import useSWR, { type SWRConfiguration } from "swr"

import { routes } from "@/web/routes"
import type { ConnectedUser } from "@/types"

export const useUser = () => {
  const config: SWRConfiguration = {
    revalidateOnFocus: false,
    refreshInterval: 60000,
    revalidateOnReconnect: true,
  }

  const { data, ...query } = useSWR<ConnectedUser, Error>(
    routes.auth.me,
    config
  )

  return {
    data: data?.result,
    ...query,
  }
}
