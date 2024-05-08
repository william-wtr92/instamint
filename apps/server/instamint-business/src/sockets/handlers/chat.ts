import {
  events,
  type ChatMessage,
  type JoinRoom,
} from "@instamint/shared-types"
import type { Socket, Server as SocketIOServer } from "socket.io"

import MessageModel from "@/db/models/MessageModel"
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
    const user = socket.data.user
    const roomRecord = socket.data.roomRecord?.id

    await MessageModel.query().insert({
      roomId: roomRecord,
      userId: user?.id,
      content: data?.message,
    })

    io.to(data?.room).emit(events.chat.message, data?.message)
  })
}
