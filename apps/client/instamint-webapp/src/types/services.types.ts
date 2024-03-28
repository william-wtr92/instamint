import type { AxiosInstance } from "axios"

import type { AppContextType } from "@/types"

type ArgsPrepareServices = {
  api: AxiosInstance
  jwt?: string
}

export type PrepareServicesContext = (
  context: ArgsPrepareServices
) => AppContextType

export type Services<T> = (
  args: ArgsPrepareServices
) => (data: T) => Promise<[Error | null, T?]>
