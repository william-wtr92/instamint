import { ReactNode } from "react"

import { UsersServices } from "@/types"

export type AppContextProviderProps = {
  children: ReactNode
}

export type ServicesActions<T> = (data: T) => Promise<[Error | null, T?]>

type ServicesActionsMappings<Actions extends Record<string, unknown>> = {
  [K in keyof Actions]: ServicesActions<Actions[K]>
}

export type AppContextType = {
  services: {
    users: ServicesActionsMappings<UsersServices>
  }
}
