import { events, type ChatMessage } from "@instamint/shared-types"

import type { SocketServices } from "@/types"

export const chatMessageService: SocketServices<ChatMessage> =
  ({ socket }) =>
  (data) => {
    socket.emit(events.chat.message, {
      room: data.room,
      message: data.message,
    })
  }
