import type { AxiosInstance } from "axios"

type ApiClientArgs = {
  baseURL: string
}

export type CreateApiClient = (args: ApiClientArgs) => AxiosInstance

type Route = string
type RouteFunction = (...args: never[]) => string

type RouteObject = {
  [key: string]: Route | RouteObject | RouteFunction
}

export const defineRoutes = <T extends RouteObject>(routes: T): T => {
  return routes
}
