import type { Publication } from "@instamint/shared-types"
import useSWR, { type SWRConfiguration } from "swr"

import { routes } from "@/web/routes"

type FetcherData = {
  result: Publication
}

export const useGetPublicationFromId = (publicationId: number) => {
  const config: SWRConfiguration = {
    revalidateOnFocus: false,
    refreshInterval: 10000,
    revalidateOnReconnect: true,
  }

  const { data, ...query } = useSWR<FetcherData, Error>(
    routes.api.users.publications.getPublication(publicationId.toString()),
    config
  )

  return {
    data: data?.result,
    ...query,
  }
}
