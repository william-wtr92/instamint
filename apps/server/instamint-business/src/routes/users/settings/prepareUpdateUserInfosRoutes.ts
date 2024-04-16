import { type Context, Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { type ApiRoutes, SC } from "@instamint/server-types"
import { type UserInfosSchema, userInfosSchema } from "@instamint/shared-types"

import { createErrorResponse } from "@/utils/errors/createErrorResponse"
import { authMessages, globalsMessages, usersMessages } from "@/def"
import { handleError } from "@/middlewares/handleError"
import UserModel from "@/db/models/UserModel"

const prepareUpdateUserInfosRoutes: ApiRoutes = ({ app, db, redis }) => {
  const updateUserInfos = new Hono()

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

  updateUserInfos.put(
    "/update-account",
    zValidator("json", userInfosSchema),
    async (c: Context): Promise<Response> => {
      const requestBody = await c.req.json()
      const { username, email }: UserInfosSchema = requestBody
      const user = await UserModel.query().findOne({ email })

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      if (username && user.username == username) {
        return c.json(usersMessages.usernameAlreadyExist, SC.errors.BAD_REQUEST)
      }

      const existingUsername = await UserModel.query().findOne({ username })

      if (existingUsername) {
        return c.json(usersMessages.sameUsername, SC.errors.BAD_REQUEST)
      }

      const updatedUser = await UserModel.query()
        .where({ email })
        .update({
          ...(username ? { username } : {}),
        })

      if (!updatedUser) {
        return c.json(usersMessages.userNotModified, SC.errors.NOT_FOUND)
      }

      return c.json(SC.success.OK)
    }
  )

  updateUserInfos.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/users", updateUserInfos)
}

export default prepareUpdateUserInfosRoutes
