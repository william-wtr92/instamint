import type { ReactNode } from "react"

import type { AuthServices, UsersServices } from "@/types"

export type AppContextProviderProps = {
  children: ReactNode
}

/* Services Context */

type ServicesActions<T> = (data: T) => Promise<[Error | null, T?]>

type ServicesActionsMappings<Actions extends Record<string, unknown>> = {
  [K in keyof Actions]: ServicesActions<Actions[K]>
}

export type AppContextType = {
  services: {
    auth: ServicesActionsMappings<AuthServices>
    users: ServicesActionsMappings<UsersServices>
  }
}

/* Actions Context */

export type ActionsContextType = {
  language: string
  changeLanguage: (newLanguage: string) => Promise<void>
  redirectTrigger: boolean
  redirectLink: string
  redirectDelay: number
  redirect: (link: string, delay?: number) => void
  error: Error | string | null
  setError: (error: Error | string | null, duration?: number) => void
  success: string | null
  setSuccess: (success: string | null, duration?: number) => void
}
