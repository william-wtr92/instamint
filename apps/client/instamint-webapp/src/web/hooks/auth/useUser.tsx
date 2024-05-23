import useSWR, { type SWRConfiguration } from "swr"

import type { ConnectedUserResult } from "@/types"
import { routes } from "@/web/routes"

export const useUser = () => {
  const config: SWRConfiguration = {
    revalidateOnFocus: false,
    refreshInterval: 150000,
    revalidateOnReconnect: true,
  }

  const { data, ...query } = useSWR<ConnectedUserResult, Error>(
    routes.api.auth.me,
    config
  )

  return {
    data: data?.result,
    ...query,
  }
}
