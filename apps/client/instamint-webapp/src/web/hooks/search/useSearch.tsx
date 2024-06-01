import type { Search } from "@instamint/shared-types"
import { type SWRConfiguration } from "swr"
import useSWRInfinite, { type SWRInfiniteResponse } from "swr/infinite"

import type { Pagination, User } from "@/types"
import { routes } from "@/web/routes"

type SearchData = {
  result: {
    users: Pick<User, "id" | "username" | "email">[]
    pagination: Pagination
  }
}

const getKey = (
  query: string,
  pageIndex: number,
  previousPageData: SearchData | null
) => {
  if (previousPageData && previousPageData.result.users.length === 0) {
    return null
  }

  const numberOfNotifications = 10
  const offset = pageIndex * numberOfNotifications

  const MIN_QUERY_LENGTH = 3
  const shouldFetch = query.length >= MIN_QUERY_LENGTH

  return shouldFetch
    ? routes.api.search.get({ query, offset: offset.toString() })
    : null
}

export const useSearch = (
  queries: Pick<Search, "query">
): SWRInfiniteResponse<SearchData, Error> => {
  const config: SWRConfiguration = {
    revalidateOnFocus: false,
    refreshInterval: 150000,
    revalidateOnReconnect: true,
  }

  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite<
    SearchData,
    Error
  >(
    (pageIndex, previousPageData) =>
      getKey(queries.query, pageIndex, previousPageData),
    config
  )

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
