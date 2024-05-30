import { type SWRConfiguration } from "swr"
import useSWRInfinite, { type SWRInfiniteResponse } from "swr/infinite"

import type { Notifications } from "@/types"
import { routes } from "@/web/routes"

type FetcherData = {
  result: {
    notifications: Notifications[]
    totalCount: number
    totalPage: number
  }
}

const getKey = (pageIndex: number, previousPageData: FetcherData | null) => {
  if (previousPageData && previousPageData.result.notifications.length === 0) {
    return null
  }

  const numberOfNotifications = 10
  const offset = pageIndex * numberOfNotifications

  return routes.api.users.notifications.getNotifications({
    offset: offset.toString(),
  })
}

export const useNotification = (): SWRInfiniteResponse<FetcherData, Error> => {
  const config: SWRConfiguration = {
    revalidateOnFocus: false,
    refreshInterval: 5000,
    revalidateOnReconnect: true,
  }

  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite<
    FetcherData,
    Error
  >(getKey, config)

  const isLoading = !data && !error && isValidating

  return {
    data,
    isValidating,
    isLoading,
    error,
    size,
    setSize,
    mutate,
  }
}
