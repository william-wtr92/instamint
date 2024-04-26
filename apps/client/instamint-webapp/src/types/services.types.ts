import type { AxiosInstance } from "axios"

import type { AppContextType, ServicesActions } from "@/types"

type ArgsPrepareServices = {
  api: AxiosInstance
}

export type PrepareServicesContext = (
  context: ArgsPrepareServices
) => AppContextType

export type Services<P, R> = (
  args: ArgsPrepareServices
) => ServicesActions<P, R>
