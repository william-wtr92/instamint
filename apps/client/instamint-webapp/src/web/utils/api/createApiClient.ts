import axios from "axios"

import type { CreateApiClient } from "@/types"

export const createApiClient: CreateApiClient = ({ baseURL }) => {
  return axios.create({
    baseURL,
  })
}
