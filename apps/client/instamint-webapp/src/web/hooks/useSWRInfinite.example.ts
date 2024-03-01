import { getApiClient } from "@/web/services/getApiClient"
import useSWRInfinite, { SWRInfiniteResponse } from "swr/infinite"

// These types are just for example
type PreviousPageDataType = {
  data: Array<unknown>
}

type FetcherData = {
  data: Array<unknown>
}

const getKey = (pageIndex: number, previousPageData: PreviousPageDataType) => {
  // Reached the end
  if (previousPageData && !previousPageData.data.length) {
    return null
  }

  return `url with nextPage in query`
}

const fetcher = async (url: string): Promise<FetcherData> => {
  const apiClient = getApiClient()

  const { data } = await apiClient.get(url)

  return {
    data,
  }
}

// Here this hook needs to receive in parameters the current page we're in, you can do so sending query parameters
// including the current page, or just sending the page from the client
const useSWRInfiniteExample = (): SWRInfiniteResponse => {
  // Inside query, you find { data, error, isLoading, isValidating, size, setSize }, this is to avoid repeating code
  const { ...query } = useSWRInfinite(
    (pageIndex: number, previousPageData) =>
      getKey(pageIndex, previousPageData),
    fetcher,
  )

  return {
    ...query,
  }
}

export default useSWRInfiniteExample
