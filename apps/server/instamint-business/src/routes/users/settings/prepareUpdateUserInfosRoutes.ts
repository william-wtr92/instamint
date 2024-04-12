import { type Context, Hono } from "hono"
import { zValidator } from "@hono/zod-validator"

import { type ApiRoutes, SC } from "@instamint/server-types"
import { createErrorResponse } from "@/utils/errors/createErrorResponse"
import { authMessages, globalsMessages, usersMessages } from "@/def"
import { handleError } from "@/middlewares/handleError"
import UserModel from "@/db/models/UserModel"
import { type UserInfosSchema, userInfosSchema } from "@instamint/shared-types"

const prepareUpdateUserInfosRoutes: ApiRoutes = ({ app, db, redis }) => {
  const userAction = new Hono()

  if (!db) {
    throw createErrorResponse(
      globalsMessages.databaseNotAvailable,
      SC.serverErrors.INTERNAL_SERVER_ERROR
    )
  }

  if (!redis) {
    throw createErrorResponse(
      globalsMessages.redisNotAvailable,
      SC.serverErrors.INTERNAL_SERVER_ERROR
    )
  }

  userAction.put(
    "/update-account",
    zValidator("json", userInfosSchema),
    async (c: Context): Promise<Response> => {
      const requestBody = await c.req.json()
      const { username, email }: UserInfosSchema = requestBody
      const user = await UserModel.query().findOne({ email })

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      if (user.username !== username) {
        const existUsername = await UserModel.query().findOne({ username })

        if (existUsername) {
          return c.json(
            usersMessages.usernameAlreadyExist,
            SC.errors.BAD_REQUEST
          )
        }
      }

      const update = await UserModel.query()
        .where({ email })
        .update({
          ...(username ? { username } : {}),
        })

      if (!update) {
        return c.json(usersMessages.userNotModified, SC.errors.NOT_FOUND)
      }

      return c.json(SC.success.OK)
    }
  )

  userAction.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/users", userAction)
}

export default prepareUpdateUserInfosRoutes
