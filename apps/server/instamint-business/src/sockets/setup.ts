import type { Server as HTTPSServer } from "node:http"
import { Server as SocketIOServer } from "socket.io"

import appConfig from "@/db/config/config"
import type RoomModel from "@/db/models/RoomModel"
import type UserModel from "@/db/models/UserModel"

type SocketData = {
  user?: UserModel
  roomRecord?: RoomModel
}

export const setupWs = (server: HTTPSServer): SocketIOServer => {
  return new SocketIOServer<SocketData>(server, {
    cors: {
      origin: appConfig.security.cors.origin,
      credentials: appConfig.security.cors.credentials,
      methods: ["GET", "POST"],
    },
  })
}
