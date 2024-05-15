import { events } from "@instamint/shared-types"
import type { Server as HTTPSServer } from "node:http"

import { accessRoom } from "@/middlewares/ws/accessRoom"
import { authWs } from "@/middlewares/ws/authWs"
import { chat } from "@/sockets/handlers/chat"
import { setupWs } from "@/sockets/setup"

export const initWs = (server: HTTPSServer) => {
  const io = setupWs(server)

  io.use(authWs)
  io.use(accessRoom)

  io.on(events.connection, (socket) => {
    chat(io, socket)
  })
}
