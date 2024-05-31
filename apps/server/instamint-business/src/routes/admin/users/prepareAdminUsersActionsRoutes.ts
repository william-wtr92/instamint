import { zValidator } from "@hono/zod-validator"
import { type ApiRoutes, SC } from "@instamint/server-types"
import {
  userIdAdminAction,
  type UserIdAdminAction,
} from "@instamint/shared-types"
import { type Context, Hono } from "hono"

import UserModel from "@/db/models/UserModel"
import {
  adminMessages,
  authMessages,
  globalsMessages,
  redisKeys,
  usersMessages,
} from "@/def"
import { handleError } from "@/middlewares/handleError"
import { throwInternalError } from "@/utils/errors/throwInternalError"
import { nowDate, sixMonthsDate } from "@/utils/helpers/times"

const prepareAdminUsersActionsRoutes: ApiRoutes = ({ app, db, redis }) => {
  const adminUsersActions = new Hono()

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

  adminUsersActions.put(
    "/:id/deactivate",
    zValidator("param", userIdAdminAction),
    async (c: Context): Promise<Response> => {
      const { id } = c.req.param() as UserIdAdminAction

      const user = await UserModel.query().findById(id)

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      if (!user.active) {
        return c.json(
          usersMessages.accountAlreadyDeactivated,
          SC.errors.BAD_REQUEST
        )
      }

      await UserModel.query()
        .findById(id)
        .patch({ active: false, deactivationDate: nowDate })

      return c.json(
        {
          message: adminMessages.userDeactivatedSuccessfully.message,
        },
        SC.success.OK
      )
    }
  )

  adminUsersActions.put(
    "/:id/reactivate",
    zValidator("param", userIdAdminAction),
    async (c: Context): Promise<Response> => {
      const { id } = c.req.param() as UserIdAdminAction

      const user = await UserModel.query().findById(id)

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      if (user.active) {
        return c.json(
          usersMessages.accountAlreadyActivated,
          SC.errors.BAD_REQUEST
        )
      }

      await UserModel.query()
        .findById(id)
        .patch({ active: true, deactivationDate: null })

      return c.json(
        {
          message: adminMessages.userReactivatedSuccessfully.message,
        },
        SC.success.OK
      )
    }
  )

  adminUsersActions.delete(
    "/:id/delete",
    zValidator("param", userIdAdminAction),
    async (c: Context): Promise<Response> => {
      const { id } = c.req.param() as UserIdAdminAction

      const user = await UserModel.query().findById(id)

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      if (!user.active || user.deletionDate !== null) {
        return c.json(
          usersMessages.accountAlreadyDeactivated,
          SC.errors.BAD_REQUEST
        )
      }

      await UserModel.query().where({ email: user.email }).update({
        active: false,
        deactivationDate: nowDate,
        deletionDate: sixMonthsDate,
      })

      const sessionKey = redisKeys.auth.authSession(user.email)

      await redis.del(sessionKey)

      return c.json(
        { message: usersMessages.deletedAccount.message },
        SC.success.OK
      )
    }
  )

  adminUsersActions.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/admin/users", adminUsersActions)
}

export default prepareAdminUsersActionsRoutes
