import { zValidator } from "@hono/zod-validator"
import { type ApiRoutes, SC } from "@instamint/server-types"
import {
  type SearchByEmail,
  searchByEmailSchema,
} from "@instamint/shared-types"
import { type Context, Hono } from "hono"

import UserModel from "@/db/models/UserModel"
import { authMessages, contextsKeys, globalsMessages } from "@/def"
import { searchByEmailUpdatedSuccessfully } from "@/def/resources/usersMessages"
import { auth } from "@/middlewares/auth"
import { handleError } from "@/middlewares/handleError"
import { throwInternalError } from "@/utils/errors/throwInternalError"

const prepareSearchByEmailRoutes: ApiRoutes = ({ app, db, redis }) => {
  const searchByEmail = new Hono()

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

  searchByEmail.put(
    "/search-by-email",
    auth,
    zValidator("json", searchByEmailSchema),
    async (c: Context): Promise<Response> => {
      const contextUser: UserModel = c.get(contextsKeys.user)
      const { searchByEmail }: SearchByEmail = await c.req.json()

      const user = await UserModel.query().findOne({ email: contextUser.email })

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      await UserModel.query().patchAndFetchById(user.id, {
        searchByEmail,
      })

      return c.json(
        searchByEmailUpdatedSuccessfully(searchByEmail),
        SC.success.OK
      )
    }
  )

  searchByEmail.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/users", searchByEmail)
}

export default prepareSearchByEmailRoutes
