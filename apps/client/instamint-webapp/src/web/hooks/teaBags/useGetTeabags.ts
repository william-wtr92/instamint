import { type SWRConfiguration } from "swr"
import useSWRInfinite, { type SWRInfiniteResponse } from "swr/infinite"

import type { TeaBags } from "@/types"
import { routes } from "@/web/routes"

type TeabagsData = {
  result: {
    teabags: TeaBags[]
  }
}

const getKey = (pageIndex: number, previousPageData: TeabagsData | null) => {
  if (previousPageData && previousPageData.result.teabags.length === 0) {
    return null
  }

  const numberOfTabags = 15
  const offset = pageIndex * numberOfTabags

  return routes.api.teaBags.get({ offset: offset.toString() })
}

export const useGetTeaBags = (): SWRInfiniteResponse<TeabagsData, Error> => {
  const config: SWRConfiguration = {
    revalidateOnFocus: false,
    refreshInterval: 150000,
    revalidateOnReconnect: true,
  }

  const { data, ...query } = useSWRInfinite<TeabagsData, Error>(
    (pageIndex, previousPageData) => getKey(pageIndex, previousPageData),
    config
  )

  return {
    data,
    ...query,
  }
}
