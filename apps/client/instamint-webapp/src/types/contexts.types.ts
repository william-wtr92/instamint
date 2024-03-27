import type { ReactNode } from "react"

import type { UsersServices } from "@/types"

export type AppContextProviderProps = {
  children: ReactNode
}

type ServicesActions<T> = (data: T) => Promise<[Error | null, T?]>

type ServicesActionsMappings<Actions extends Record<string, unknown>> = {
  [K in keyof Actions]: ServicesActions<Actions[K]>
}

export type AppContextType = {
  services: {
    users: ServicesActionsMappings<UsersServices>
  }
}
