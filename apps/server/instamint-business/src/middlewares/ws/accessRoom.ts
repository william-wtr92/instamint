import { events } from "@instamint/shared-types"
import type { Socket } from "socket.io"

import RoomModel from "@/db/models/RoomModel"
import RoomUserModel from "@/db/models/RoomUserModel"
import { wsMessages } from "@/def"
import type { ExtendedError } from "@/types"

export const accessRoom = (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => {
  socket.use(async (packet, nextPacket) => {
    const [event, data] = packet

    if (event === events.chat.message) {
      try {
        const user = socket.data.user

        const roomRecord = await RoomModel.query()
          .where({ name: data?.room.trim() })
          .first()

        if (!roomRecord) {
          socket.emit(events.error, wsMessages.roomNotFound)

          return
        }

        const isMember = await RoomUserModel.query()
          .where({
            roomId: roomRecord.id,
            userId: user.id,
          })
          .first()

        if (!isMember) {
          socket.emit(events.error, wsMessages.notRoomMember)

          return
        }

        socket.data.roomRecord = roomRecord

        nextPacket()
      } catch (error) {
        socket.emit(events.error, wsMessages.roomProcessingError)

        nextPacket(new Error(wsMessages.roomProcessingError.message))
      }
    } else {
      nextPacket()
    }
  })

  next()
}
