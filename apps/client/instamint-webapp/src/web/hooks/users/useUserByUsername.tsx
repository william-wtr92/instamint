import type { Profile } from "@instamint/shared-types"
import useSWR, { type SWRConfiguration } from "swr"

import type { ProfileUserResult } from "@/types"
import { routes } from "@/web/routes"

export const useUserByUsername = (getUser: Profile) => {
  const config: SWRConfiguration = {
    revalidateOnFocus: true,
    refreshInterval: 5000,
    revalidateOnReconnect: true,
  }

  const { data, ...query } = useSWR<ProfileUserResult, Error>(
    routes.api.users.profile.getProfile(getUser),
    config
  )

  return {
    data: data?.result,
    followers: data?.followers,
    followed: data?.followed,
    isFollowing: data?.isFollowing,
    requestPending: data?.requestPending,
    ...query,
  }
}
