import axios from "axios"

import { CreateApiClient } from "@/types"

export const createApiClient: CreateApiClient = ({ jwt, baseURL }) => {
  return axios.create({
    baseURL,
    headers: {
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
  })
}
