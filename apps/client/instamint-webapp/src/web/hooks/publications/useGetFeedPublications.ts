import type { Publication } from "@instamint/shared-types"
import { type SWRConfiguration } from "swr"
import useSWRInfinite, { type SWRInfiniteResponse } from "swr/infinite"

import { routes } from "@/web/routes"

type FetcherData = {
  result: {
    publications: Publication[]
  }
}

const getKey = (pageIndex: number, previousPageData: FetcherData | null) => {
  if (previousPageData && previousPageData.result.publications.length === 0) {
    return null
  }

  const limitPerPage = 6
  const offset = pageIndex

  return routes.api.users.publications.getFeedPublications({
    limit: limitPerPage.toString(),
    offset: offset.toString(),
  })
}

export const useGetFeedPublications = (): SWRInfiniteResponse<
  FetcherData,
  Error
> => {
  const config: SWRConfiguration = {
    revalidateOnFocus: false,
    refreshInterval: 10000,
    revalidateOnReconnect: true,
  }

  const query = useSWRInfinite<FetcherData, Error>(
    (pageIndex, previousPageData) => getKey(pageIndex, previousPageData),
    config
  )

  return {
    ...query,
  }
}
