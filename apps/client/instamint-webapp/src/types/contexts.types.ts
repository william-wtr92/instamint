import type { ReactNode } from "react"

import type { AuthServices } from "@/types"

export type AppContextProviderProps = {
  children: ReactNode
}

type ServicesActions<T> = (data: T) => Promise<[Error | null, T?]>

type ServicesActionsMappings<Actions extends Record<string, unknown>> = {
  [K in keyof Actions]: ServicesActions<Actions[K]>
}

export type AppContextType = {
  services: {
    auth: ServicesActionsMappings<AuthServices>
  }
}
