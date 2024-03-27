import type { AxiosInstance } from "axios"

import type { AppContextType } from "@/types"

export type Api = {
  api: AxiosInstance
}

type ArgsPrepareServices = Api & {
  jwt?: string
}

export type PrepareServicesContext = (
  args: ArgsPrepareServices
) => AppContextType

export type Services<T> = (
  args: Api
) => (data: T) => Promise<[Error | null, T?]>
