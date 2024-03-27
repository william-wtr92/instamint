import axios from "axios"

import type { CreateApiClient } from "@/types"

export const createApiClient: CreateApiClient = ({ jwt, baseURL }) => {
  return axios.create({
    baseURL,
    headers: {
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
  })
}
