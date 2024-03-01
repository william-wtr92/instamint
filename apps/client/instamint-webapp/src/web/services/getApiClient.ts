import Axios, { AxiosInstance } from "axios"

// Unfinished GetApiClient for now
export const getApiClient = () => {
  const reqInstance: AxiosInstance = Axios.create({
    headers: {
      Authorization: `Bearer`,
    },
  })

  return reqInstance
}
