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
import { throwInternalError } from "@/utils/errors/throwInternalError"

const prepareUpdateUserInfosRoutes: ApiRoutes = ({ app, db, redis }) => {
  const updateUserInfos = new Hono()

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
        const existingLink = await UserModel.query().findOne({
          link: "/" + link,
        })

        if (existingLink) {
          return c.json(usersMessages.linkAlreadyExist, SC.errors.BAD_REQUEST)
        }
      }

      const updatedUser = await UserModel.query()
        .where({ email: contextUser.email })
        .update({
          ...(username ? { username } : {}),
          ...(bio !== undefined ? { bio } : undefined),
          ...(link !== undefined ? { link: "/" + link } : undefined),
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
