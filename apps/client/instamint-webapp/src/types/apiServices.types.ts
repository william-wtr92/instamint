import type { AxiosInstance } from "axios"

import type { AppContextType } from "@/types"

type ArgsPrepareServices = {
  api: AxiosInstance
}

export type PrepareServicesContext = (
  context: ArgsPrepareServices
) => Pick<AppContextType, "services">

export type Services<T> = (
  args: ArgsPrepareServices
) => (data: T) => Promise<[Error | null, T?]>
