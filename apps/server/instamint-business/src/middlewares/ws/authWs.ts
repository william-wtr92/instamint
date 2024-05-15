import { events } from "@instamint/shared-types"
import type { Socket } from "socket.io"

import UserModel from "@/db/models/UserModel"
import { authMessages, globalsMessages, wsMessages } from "@/def"
import type { ExtendedError } from "@/types"
import { sanitizeUser } from "@/utils/dto/sanitizeUsers"
import { decodeJwt, restructureJwt } from "@/utils/helpers/actions/jwtActions"

export const authWs = async (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => {
  socket.use(async (packet, nextPacket) => {
    const [event] = packet

    if (
      event === events.connection ||
      event === events.chat.message ||
      event === events.room.join
    ) {
      const cookieValue = socket.handshake.headers.cookie?.split("=")[1]

      if (!cookieValue) {
        socket.emit(events.error, wsMessages.cookieNotSet)

        return
      }

      const token = await restructureJwt(cookieValue)

      const decodedToken = await decodeJwt(token)

      try {
        if (
          typeof decodedToken === "object" &&
          decodedToken !== null &&
          "payload" in decodedToken &&
          "user" in decodedToken.payload
        ) {
          const userId = decodedToken.payload.user.id
          const user = await UserModel.query()
            .findById(userId)
            .withGraphFetched("roleData")

          if (!user) {
            socket.emit(events.error, authMessages.userNotFound)

            return
          }

          socket.data.user = sanitizeUser(user, ["id"])

          nextPacket()
        } else {
          socket.emit(events.error, globalsMessages.tokenExpired)

          nextPacket(new Error(globalsMessages.tokenExpired.message))
        }
      } catch (err) {
        nextPacket(new Error(globalsMessages.tokenExpired.message))
      }
    }
  })
  next()
}
