import useSWR, { SWRResponse } from "swr"
import { getApiClient } from "@/web/services/getApiClient"

// This type is just for example
type FetcherData = {
  data: Array<unknown>
}

const fetcher = async (url: string): Promise<FetcherData> => {
  const apiClient = getApiClient()

  const { data } = await apiClient.get(url)

  return {
    data,
  }
}

const useSWRExample = (): SWRResponse => {
  const url = "url.example.com"

  // Inside query, you find { data, error, isLoading, isValidating, mutate }, this is to avoid repeating code
  const { ...query } = useSWR(url, fetcher)

  return {
    ...query,
  }
}

export default useSWRExample
