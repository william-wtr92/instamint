import { AxiosInstance } from "axios"

export type Api = {
  api: AxiosInstance
}

export type PrepareServicesType = Api & {
  jwt?: string
}

export type ServicesTypes<T> = (
  args: Api
) => (data: T) => Promise<[Error | null, T?]>
