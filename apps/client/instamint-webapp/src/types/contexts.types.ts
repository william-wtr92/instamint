import type { ChatMessage, JoinRoom } from "@instamint/shared-types"
import type { ToastType as Toast, ToasterToast } from "@instamint/ui-kit"
import type { ReactNode } from "react"

import type { AuthServices, UsersServices, AdminServices } from "@/types"

export type AppContextProviderProps = {
  children: ReactNode
}

/* Services Context */

export type ServicesActions<P, R> = (data: P) => Promise<[Error | null, R?]>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ServicesActionsMappings<Actions extends Record<string, any>> = {
  [K in keyof Actions]: ServicesActions<Actions[K][0], Actions[K][1]>
}

export type AppContextType = {
  services: {
    auth: ServicesActionsMappings<AuthServices>
    users: ServicesActionsMappings<UsersServices>
    admin: ServicesActionsMappings<AdminServices>
  }
  socket: {
    joinRoom: <C>(data: JoinRoom, callback: C) => void
    chatMessage: (data: ChatMessage) => void
  }
  publicationId: number | null
  setPublicationId: (id: number | null) => void
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
