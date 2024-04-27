import { zValidator } from "@hono/zod-validator"
import { type ApiRoutes, SC } from "@instamint/server-types"
import { type UserInfos, userInfosSchema } from "@instamint/shared-types"
import { type Context, Hono } from "hono"

import UserModel from "@/db/models/UserModel"
import {
  authMessages,
  contextsKeys,
  globalsMessages,
  usersMessages,
} from "@/def"
import { auth } from "@/middlewares/auth"
import { handleError } from "@/middlewares/handleError"
import { createErrorResponse } from "@/utils/errors/createErrorResponse"

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
      const { username, bio, link, location }: UserInfos = requestBody

      const user = await UserModel.query().findOne({ email: contextUser.email })

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      if (
        user.username === username &&
        user.bio === bio &&
        user.link === link &&
        user.location === location
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
          ...(location ? { location } : {}),
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
