import type { AdminUsersAll } from "@instamint/shared-types"
import useSWR, { type SWRConfiguration } from "swr"

import type { UsersResult } from "@/types"
import { routes } from "@/web/routes"

export const useUsers = (queries: AdminUsersAll) => {
  const config: SWRConfiguration = {
    revalidateOnFocus: false,
    refreshInterval: 150000,
    revalidateOnReconnect: true,
  }

  const { data, ...query } = useSWR<UsersResult, Error>(
    routes.api.admin.users.all(queries),
    config
  )

  return {
    data: data?.result.users,
    pagination: data?.result.pagination,
    ...query,
  }
}
