import axios from "axios"

// Unfinished GetApiClient for now
export const getApiClient = () => {
  return axios.create({
    headers: {
      Authorization: `Bearer`,
    },
  })
}
