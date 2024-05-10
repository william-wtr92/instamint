import { type JoinRoom, events } from "@instamint/shared-types"

import type { SocketServices } from "@/types"

export const joinRoomService: SocketServices<JoinRoom> =
  ({ socket }) =>
  (data, callback) => {
    socket.once(events.room.join, (response: { roomName: string }) => {
      if (typeof callback !== "function") {
        return
      }

      callback(response.roomName)
    })

    socket.emit(events.room.join, data)
  }
