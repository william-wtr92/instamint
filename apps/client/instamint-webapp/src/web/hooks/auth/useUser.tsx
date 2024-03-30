import useSWR from "swr"

import { routes } from "@/web/routes"
import type { ConnectedUsers } from "@/types"

export const useUser = () => {
  const { ...query } = useSWR<ConnectedUsers, Error>(routes.auth.me)

  return {
    ...query,
  }
}
