import type { ReactNode } from "react"

import type { AuthServices, UsersServices } from "@/types"
import type {
  Toast,
  ToasterToast,
} from "@instamint/ui-kit/src/types/Toast.types"

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
  redirect: (link: string, delay?: number) => void
  toast: ({ ...props }: Toast) => {
    id: string
    dismiss: () => void
    update: (props: ToasterToast) => void
  }
}
