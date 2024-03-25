import { AxiosInstance } from "axios"

type Api = {
  api: AxiosInstance
}

export type ServicesTypes<T> = (
  args: Api
) => (data: T) => Promise<[Error | null, T?]>
