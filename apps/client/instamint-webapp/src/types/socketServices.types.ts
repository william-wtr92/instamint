import type { Socket } from "socket.io-client"

import type { AppContextType } from "@/types"

/* Client */

type CreateSocketClientArgs = {
  baseUrl: string
}

export type CreateSocketClient = (args: CreateSocketClientArgs) => Socket

/* Services */

type ArgsPrepareSocketServices = {
  socket: Socket
}

export type PrepareSocketActionsContext = (
  context: ArgsPrepareSocketServices
) => Pick<AppContextType, "socket">

export type SocketServices<T> = (
  args: ArgsPrepareSocketServices
) => (data: T) => void
