import { events, type JoinRoom } from "@instamint/shared-types"
import type { Socket } from "socket.io"

import FollowerModel from "@/db/models/FollowerModel"
import RoomModel from "@/db/models/RoomModel"
import RoomUserModel from "@/db/models/RoomUserModel"
import UserModel from "@/db/models/UserModel"
import { authMessages } from "@/def"
import { generateRoomName } from "@/sockets/actions/roomActions"

export const joinRoom = async (socket: Socket, data: JoinRoom) => {
  const userAuthenticated = socket.data.user

  if (!userAuthenticated) {
    return socket.emit(events.error, {
      error: authMessages.userNotFound.errorCode,
      message: authMessages.userNotFound.message,
    })
  }

  const userTargeted = await UserModel.query()
    .where({ username: data?.userTargetedUsername })
    .first()

  if (!userTargeted) {
    return socket.emit(events.error, {
      error: authMessages.userNotFound.errorCode,
      message: authMessages.userNotFound.message,
    })
  }

  const isFollowing = await FollowerModel.query().where({
    followerId: userAuthenticated.id,
    followedId: userTargeted.id,
    status: "accepted",
  })

  if (!isFollowing) {
    return socket.emit(events.error, {
      error: authMessages.userNotFound.errorCode,
      message: authMessages.userNotFound.message,
    })
  }

  const room = generateRoomName(
    userAuthenticated.username,
    userTargeted.username
  )

  const getRoom = await RoomModel.query().where({ name: room }).first()

  if (!getRoom) {
    const roomCreated = await RoomModel.query().insert({ name: room })

    await RoomUserModel.query().insert([
      {
        roomId: roomCreated.id,
        userId: userAuthenticated?.id,
      },
      {
        roomId: roomCreated.id,
        userId: userTargeted.id,
      },
    ])
  }

  socket.join(room)
  socket.emit(events.room.join, { roomName: room })
}

export const leaveRoom = (socket: Socket, room: string) => {
  socket.leave(room)
}
