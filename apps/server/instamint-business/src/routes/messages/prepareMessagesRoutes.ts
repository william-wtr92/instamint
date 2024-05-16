import { zValidator } from "@hono/zod-validator"
import { SC, type ApiRoutes } from "@instamint/server-types"
import { getMessagesSchema } from "@instamint/shared-types"
import { type Context, Hono } from "hono"

import MessageModel from "@/db/models/MessageModel"
import RoomModel from "@/db/models/RoomModel"
import RoomUserModel from "@/db/models/RoomUserModel"
import type UserModel from "@/db/models/UserModel"
import { authMessages, contextsKeys, globalsMessages, wsMessages } from "@/def"
import { auth } from "@/middlewares/auth"
import { handleError } from "@/middlewares/handleError"
import { sanitizeMessages } from "@/utils/dto/sanitizeMessages"
import { sanitizeUser } from "@/utils/dto/sanitizeUsers"
import { throwInternalError } from "@/utils/errors/throwInternalError"

const prepareMessagesRoutes: ApiRoutes = ({ app, db, redis }) => {
  const messages = new Hono()

  if (!db) {
    throw throwInternalError(
      globalsMessages.databaseNotAvailable,
      SC.serverErrors.INTERNAL_SERVER_ERROR
    )
  }

  if (!redis) {
    throw throwInternalError(
      globalsMessages.redisNotAvailable,
      SC.serverErrors.INTERNAL_SERVER_ERROR
    )
  }

  messages.get(
    "/",
    auth,
    zValidator("query", getMessagesSchema),
    async (c: Context) => {
      const contextUser: UserModel = c.get(contextsKeys.user)
      const { roomName, limit, offset } = await c.req.query()

      if (!contextUser) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      if (!roomName) {
        return c.json(wsMessages.roomNotFound, SC.errors.NOT_FOUND)
      }

      const room = await RoomModel.query().where({ name: roomName }).first()

      if (!room) {
        return c.json(wsMessages.roomNotFound, SC.errors.NOT_FOUND)
      }

      const roomUsers = await RoomUserModel.query()
        .withGraphFetched("userData")
        .where({ roomId: room.id })

      if (!roomUsers) {
        return c.json(wsMessages.roomNotFound, SC.errors.NOT_FOUND)
      }

      const userTargeted = roomUsers.find(
        (roomUser) => roomUser.userId !== contextUser.id
      )?.userData as UserModel

      const totalMessages = await MessageModel.query()
        .where({ roomId: room.id })
        .count()

      const totalCount = parseInt(totalMessages[0].count, 10)

      const newOffset = Math.max(
        totalCount - parseInt(offset, 10) - parseInt(limit, 10),
        0
      )

      const roomMessages = await MessageModel.query()
        .where({ roomId: room.id })
        .orderBy("createdAt", "asc")
        .limit(parseInt(limit))
        .offset(Math.max(0, newOffset))

      const sortedMessages = {
        sent: sanitizeMessages(
          roomMessages.filter((message) => message.userId === contextUser.id)
        ),
        received: sanitizeMessages(
          roomMessages.filter((message) => message.userId !== contextUser.id)
        ),
      }

      return c.json(
        {
          result: {
            messages: sortedMessages,
            userTargeted: sanitizeUser(userTargeted),
          },
        },
        SC.success.OK
      )
    }
  )

  messages.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/messages", messages)
}

export default prepareMessagesRoutes
