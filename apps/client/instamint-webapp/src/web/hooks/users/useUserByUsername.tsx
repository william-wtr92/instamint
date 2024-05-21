import type { Profile } from "@instamint/shared-types"
import useSWR, { type SWRConfiguration } from "swr"

import type { ProfileUser } from "@/types"
import { routes } from "@/web/routes"

export const useUserByUsername = (getUser: Profile) => {
  const config: SWRConfiguration = {
    revalidateOnFocus: false,
    refreshInterval: 150000,
    revalidateOnReconnect: true,
  }

  const { data, ...query } = useSWR<ProfileUser, Error>(
    routes.api.users.profile.getProfile(getUser),
    config
  )

  return {
    data: data?.result,
    ...query,
  }
}
