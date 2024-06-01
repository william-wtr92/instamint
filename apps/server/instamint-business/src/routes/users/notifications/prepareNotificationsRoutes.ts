import { zValidator } from "@hono/zod-validator"
import { type ApiRoutes, SC } from "@instamint/server-types"
import {
  type ReadNotification,
  type GetNotifications,
  getNotificationsSchema,
  readNotificationSchema,
} from "@instamint/shared-types"
import { Hono, type Context } from "hono"

import NotificationModel from "@/db/models/NotificationModel"
import UserModel from "@/db/models/UserModel"
import {
  authMessages,
  contextsKeys,
  globalsMessages,
  usersMessages,
} from "@/def"
import { auth } from "@/middlewares/auth"
import { handleError } from "@/middlewares/handleError"
import { sanitizeNotifications } from "@/utils/dto/sanitizeNotifications"
import { throwInternalError } from "@/utils/errors/throwInternalError"

const prepareNotificationsRoutes: ApiRoutes = ({ app, db, redis }) => {
  const notifications = new Hono()

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

  notifications.get(
    "/",
    auth,
    zValidator("query", getNotificationsSchema),
    async (c: Context): Promise<Response> => {
      const contextUser: UserModel = c.get(contextsKeys.user)
      const { limit, offset } = (await c.req.query()) as GetNotifications

      const user = await UserModel.query().findOne({ email: contextUser.email })

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const notifications = await NotificationModel.query()
        .where({ notifiedUserId: user.id })
        .withGraphFetched("notifierUserData(selectSanitizedUser)")
        .orderBy("createdAt", "desc")
        .limit(parseInt(limit))
        .offset(parseInt(offset))

      const totalNotifications = await NotificationModel.query()
        .where({ notifiedUserId: user.id })
        .count()
      const totalCount = parseInt(totalNotifications[0].count)
      const totalPage = Math.ceil(totalCount / parseInt(limit, 10))

      return c.json(
        {
          result: {
            notifications: sanitizeNotifications(notifications),
            totalCount,
            totalPage,
          },
        },
        SC.success.OK
      )
    }
  )

  notifications.put(
    "/:notificationId/read",
    auth,
    zValidator("param", readNotificationSchema),
    async (c: Context): Promise<Response> => {
      const contextUser: UserModel = c.get(contextsKeys.user)
      const { notificationId } = c.req.param() as ReadNotification

      const user = await UserModel.query().findOne({ email: contextUser.email })

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const notification = await NotificationModel.query().findOne({
        id: notificationId,
        notifiedUserId: user.id,
      })

      if (!notification) {
        return c.json(usersMessages.notificationNotFound, SC.errors.NOT_FOUND)
      }

      await NotificationModel.query().patchAndFetchById(notification.id, {
        read: true,
      })

      return c.json(
        {
          message: usersMessages.notificationReadSuccessfully.message,
        },
        SC.success.OK
      )
    }
  )

  notifications.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/users/notifications", notifications)
}

export default prepareNotificationsRoutes
