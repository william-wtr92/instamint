import { type SWRConfiguration } from "swr"
import useSWRInfinite from "swr/infinite"

import type { Publication } from "@/types"
import { routes } from "@/web/routes"

type FetcherData = {
  result: {
    publications: Publication[]
  }
}

type SWRInfiniteResponse = {
  publications: Publication[]
  isLoading: boolean
  isError: boolean
  isReachingEnd: boolean
  size: number
  setSize: (size: number | ((size: number) => number)) => void
}

const getKey = (pageIndex: number, previousPageData: FetcherData | null) => {
  if (previousPageData && previousPageData.result.publications.length === 0) {
    return null
  }

  const numberOfPublicationPerPage = 6
  const offset = pageIndex * numberOfPublicationPerPage

  return routes.api.users.publications.getPublications({
    offset: offset.toString(),
  })
}

export const usePublication = (): SWRInfiniteResponse => {
  const config: SWRConfiguration = {
    revalidateOnFocus: false,
    refreshInterval: 1000,
    revalidateOnReconnect: true,
  }

  const { data, error, size, setSize, isValidating } = useSWRInfinite<
    FetcherData,
    Error
  >(
    (pageIndex, previousPageData) => getKey(pageIndex, previousPageData),
    config
  )

  const isLoading = !data && !error && isValidating
  const isError = !!error

  const isReachingEnd = data
    ? data[data.length - 1].result.publications.length === 0
    : false

  const allPublications: Publication[] = []
  const uniqueImagePublication = new Set<string>()

  if (data) {
    data.forEach((page) => {
      ;[...page.result.publications].forEach((publication) => {
        if (!uniqueImagePublication.has(publication.image)) {
          uniqueImagePublication.add(publication.image)
          allPublications.push(publication)
        }
      })
    })
  }

  return {
    publications: allPublications,
    isLoading,
    isError,
    isReachingEnd,
    size,
    setSize,
  }
}
