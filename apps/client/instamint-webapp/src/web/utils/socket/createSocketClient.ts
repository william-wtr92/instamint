import { io, type Socket } from "socket.io-client"

import type { CreateSocketClient } from "@/types"

export const createSocketClient: CreateSocketClient = ({ baseUrl }): Socket => {
  return io(baseUrl, {
    withCredentials: true,
  })
}
