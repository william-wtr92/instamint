import { type JoinRoom, events } from "@instamint/shared-types"

import type { SocketServices } from "@/types"

export const joinRoomService: SocketServices<JoinRoom> =
  ({ socket }) =>
  (data) => {
    socket.emit(events.room.join, data.userTargetedUsername)
  }
