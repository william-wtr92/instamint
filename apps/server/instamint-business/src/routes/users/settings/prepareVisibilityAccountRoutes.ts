import { zValidator } from "@hono/zod-validator"
import { type ApiRoutes, SC } from "@instamint/server-types"
import { visibilitySchema, type Visibility } from "@instamint/shared-types"
import { type Context, Hono } from "hono"

import FollowersModel from "@/db/models/FollowersModel"
import UserModel from "@/db/models/UserModel"
import {
  authMessages,
  contextsKeys,
  globalsMessages,
  usersMessages,
} from "@/def"
import { auth } from "@/middlewares/auth"
import { handleError } from "@/middlewares/handleError"
import { throwInternalError } from "@/utils/errors/throwInternalError"

const prepareVisibilityAccountRoutes: ApiRoutes = ({ app, db, redis }) => {
  const visibility = new Hono()

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

  visibility.put(
    "/visibility",
    auth,
    zValidator("json", visibilitySchema),
    async (c: Context): Promise<Response> => {
      const contextUser: UserModel = c.get(contextsKeys.user)
      const requestBody = await c.req.json()
      const { isPrivate }: Visibility = requestBody

      const user = await UserModel.query().findOne({ email: contextUser.email })

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      await UserModel.query().patchAndFetchById(user.id, {
        private: isPrivate,
      })

      if (!isPrivate) {
        await FollowersModel.query()
          .where({ followedId: user.id, status: "pending" })
          .patch({ status: "accepted" })
      }

      return c.json(
        { message: usersMessages.visibilityUpdated.message },
        SC.success.OK
      )
    }
  )

  visibility.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/users", visibility)
}

export default prepareVisibilityAccountRoutes
