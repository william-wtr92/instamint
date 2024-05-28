import useSWR, { type SWRConfiguration } from "swr"

import type { ProfileUserFollowerRequestsResult } from "@/types"
import { routes } from "@/web/routes"

export const useUserFollowRequests = () => {
  const config: SWRConfiguration = {
    revalidateOnFocus: true,
    refreshInterval: 15000,
    revalidateOnReconnect: true,
  }

  const { data, ...query } = useSWR<ProfileUserFollowerRequestsResult, Error>(
    routes.api.users.profile.getFollowRequests,
    config
  )

  return {
    data: data?.result,
    ...query,
  }
}
