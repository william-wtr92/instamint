import type { PrepareSocketActionsContext } from "@/types"
import { chatMessageService } from "@/web/services/messages/chatMessageService"
import { joinRoomService } from "@/web/services/messages/joinRoomService"

export const prepareSocketServices: PrepareSocketActionsContext = (context) => {
  return {
    socket: {
      joinRoom: joinRoomService(context),
      chatMessage: chatMessageService(context),
    },
  }
}
