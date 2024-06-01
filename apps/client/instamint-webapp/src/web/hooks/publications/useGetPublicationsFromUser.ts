import type { Publication } from "@instamint/shared-types"
import { type SWRConfiguration } from "swr"
import useSWRInfinite, { type SWRInfiniteResponse } from "swr/infinite"

import { routes } from "@/web/routes"

type FetcherData = {
  result: {
    publications: Publication[]
  }
}

const getKey = (
  pageIndex: number,
  previousPageData: FetcherData | null,
  username: string
) => {
  if (previousPageData && previousPageData.result.publications.length === 0) {
    return null
  }

  const limitPerPage = 6
  const offset = pageIndex

  const param = {
    username,
  }

  return routes.api.users.publications.getPublications(param, {
    limit: limitPerPage.toString(),
    offset: offset.toString(),
  })
}

export const useGetPublicationsFromUser = (
  username: string
): SWRInfiniteResponse<FetcherData, Error> => {
  const config: SWRConfiguration = {
    revalidateOnFocus: false,
    refreshInterval: 10000,
    revalidateOnReconnect: true,
  }

  const { data, error, isLoading, isValidating, size, setSize, mutate } =
    useSWRInfinite<FetcherData, Error>(
      (pageIndex, previousPageData) =>
        getKey(pageIndex, previousPageData, username),
      config
    )

  return {
    data,
    error,
    isLoading,
    isValidating,
    size,
    setSize,
    mutate,
  }
}
