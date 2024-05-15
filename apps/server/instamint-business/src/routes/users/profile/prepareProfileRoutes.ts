import { zValidator } from "@hono/zod-validator"
import { type ApiRoutes, SC } from "@instamint/server-types"
import { Hono, type Context } from "hono"
import { z } from "zod"

import UserModel from "@/db/models/UserModel"
import { authMessages, globalsMessages } from "@/def"
import { auth } from "@/middlewares/auth"
import { sanitizeUser } from "@/utils/dto/sanitizeUsers"
import { throwInternalError } from "@/utils/errors/throwInternalError"

const prepareProfileRoutes: ApiRoutes = ({ app, db, redis }) => {
  const profile = new Hono()

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

  profile.get(
    "/:username",
    auth,
    zValidator(
      "param",
      z.object({
        username: z.string().min(3),
      })
    ),
    async (c: Context): Promise<Response> => {
      const { username } = c.req.param()

      const user = await UserModel.query().where({ username }).first()

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      return c.json(
        {
          result: sanitizeUser(user),
        },
        SC.success.OK
      )
    }
  )

  app.route("/profile", profile)
}

export default prepareProfileRoutes
