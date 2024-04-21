import { type Context, Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { type ApiRoutes, SC } from "@instamint/server-types"
import { type UserInfosSchema, userInfosSchema } from "@instamint/shared-types"

import { createErrorResponse } from "@/utils/errors/createErrorResponse"
import {
  authMessages,
  contextsKeys,
  globalsMessages,
  usersMessages,
} from "@/def"
import { handleError } from "@/middlewares/handleError"
import UserModel from "@/db/models/UserModel"
import { auth } from "@/middlewares/auth"

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
    auth,
    zValidator("json", userInfosSchema),
    async (c: Context): Promise<Response> => {
      const contextUser: UserModel = c.get(contextsKeys.user)
      const requestBody = await c.req.json()
      const { username, bio, link }: UserInfosSchema = requestBody

      const user = await UserModel.query().findOne({ email: contextUser.email })

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      if (
        user.username === username &&
        user.bio === bio &&
        user.link === link
      ) {
        return c.json(
          usersMessages.userInfosSameAsPrevious,
          SC.errors.BAD_REQUEST
        )
      }

      if (user.username !== username) {
        const existingUsername = await UserModel.query().findOne({ username })

        if (existingUsername) {
          return c.json(
            usersMessages.usernameAlreadyExist,
            SC.errors.BAD_REQUEST
          )
        }
      }

      if (user.link !== link) {
        const existingLink = await UserModel.query().findOne({ link })

        if (existingLink) {
          return c.json(usersMessages.linkAlreadyExist, SC.errors.BAD_REQUEST)
        }
      }

      const updatedUser = await UserModel.query()
        .where({ email: contextUser.email })
        .update({
          ...(username ? { username } : {}),
          ...(bio ? { bio } : {}),
          ...(link ? { link } : {}),
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