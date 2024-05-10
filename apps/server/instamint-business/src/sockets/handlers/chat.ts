import {
  events,
  type ChatMessage,
  type JoinRoom,
} from "@instamint/shared-types"
import type { Socket, Server as SocketIOServer } from "socket.io"

import MessageModel from "@/db/models/MessageModel"
import { authMessages, wsMessages } from "@/def"
import { joinRoom, leaveRoom } from "@/sockets/handlers/room"

export const chat = (io: SocketIOServer, socket: Socket) => {
  socket.on(events.room.join, async (data: JoinRoom) => {
    await joinRoom(socket, {
      userTargetedUsername: data?.userTargetedUsername,
    })
  })

  socket.on(events.room.leave, (room: string) => {
    leaveRoom(socket, room)
  })

  socket.on(events.chat.message, async (data: ChatMessage) => {
    const userAuthenticated = socket.data.user

    if (!userAuthenticated) {
      return socket.emit(events.error, {
        error: authMessages.userNotFound.errorCode,
        message: authMessages.userNotFound.message,
      })
    }

    const roomRecord = socket.data.roomRecord?.id

    if (!roomRecord) {
      return socket.emit(events.error, {
        error: wsMessages.roomNotFound.errorCode,
        message: wsMessages.roomNotFound.message,
      })
    }

    await MessageModel.query().insert({
      roomId: roomRecord,
      userId: userAuthenticated?.id,
      content: data?.message,
    })

    io.to(data?.room).emit(events.chat.message, data?.message)
  })
}
