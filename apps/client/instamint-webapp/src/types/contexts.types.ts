import type { ReactNode } from "react"

import type { AuthServices } from "@/types"

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
  }
}

/* Actions Context */

export type ActionsContextType = {
  triggerRedirect: boolean
  setTriggerRedirect: React.Dispatch<React.SetStateAction<boolean>>
  redirectLink: string
  setRedirectLink: React.Dispatch<React.SetStateAction<string>>
  redirectDelay: number
  setRedirectDelay: React.Dispatch<React.SetStateAction<number>>
  error: Error | string | null
  setError: (error: Error | string | null, duration?: number) => void
  success: string | null
  setSuccess: (success: string | null, duration?: number) => void
}
