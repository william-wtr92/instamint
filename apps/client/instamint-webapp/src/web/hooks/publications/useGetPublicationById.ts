import type { Publication } from "@instamint/shared-types"
import useSWR, { type SWRConfiguration } from "swr"

import { routes } from "@/web/routes"

type FetcherData = {
  result: Publication
}

export const useGetPublicationById = (publicationId: number | null) => {
  const config: SWRConfiguration = {
    revalidateOnFocus: false,
    refreshInterval: 10000,
    revalidateOnReconnect: true,
  }

  const { data, ...query } = useSWR<FetcherData, Error>(
    publicationId
      ? routes.api.users.publications.getPublication(publicationId.toString())
      : null,
    config
  )

  return {
    data: data?.result,
    ...query,
  }
}
