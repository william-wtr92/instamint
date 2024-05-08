import type { ChatMessage, JoinRoom } from "@instamint/shared-types"
import type { ToastType as Toast, ToasterToast } from "@instamint/ui-kit"
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
  socket: {
    joinRoom: (data: JoinRoom) => void
    chatMessage: (data: ChatMessage) => void
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
