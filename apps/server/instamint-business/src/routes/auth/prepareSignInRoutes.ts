import { zValidator } from "@hono/zod-validator"
import { type ApiRoutes, SC } from "@instamint/server-types"
import { type SignIn, signInSchema } from "@instamint/shared-types"
import { type Context, Hono } from "hono"

import UserModel from "@/db/models/UserModel"
import {
  globalsMessages,
  authMessages,
  redisKeys,
  cookiesKeys,
  contextsKeys,
} from "@/def"
import { auth } from "@/middlewares/auth"
import { handleError } from "@/middlewares/handleError"
import { sanitizeUser } from "@/utils/dto/sanitizeUsers"
import { throwInternalError } from "@/utils/errors/throwInternalError"
import { setCookie } from "@/utils/helpers/actions/cookiesActions"
import { signJwt } from "@/utils/helpers/actions/jwtActions"
import { oneDayTTL } from "@/utils/helpers/times"

const prepareSignInRoutes: ApiRoutes = ({ app, db, redis }) => {
  const signIn = new Hono()

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

  signIn.post(
    "/sign-in",
    zValidator("json", signInSchema),
    async (c: Context): Promise<Response> => {
      const requestBody: SignIn = await c.req.json()
      const { email, password }: SignIn = requestBody

      const user = await UserModel.query()
        .findOne({
          email,
        })
        .withGraphFetched("roleData")

      if (!user || !user.active) {
        return c.json(authMessages.emailNotExists, SC.errors.NOT_FOUND)
      }

      const validity = await user?.checkPassword(password)

      if (!validity) {
        return c.json(authMessages.invalidPassword, SC.errors.BAD_REQUEST)
      }

      const sessionKey = redisKeys.auth.authSession(email)

      const jwt = await signJwt({
        user: {
          id: user.id,
          email: user.email,
          role: user.roleData.right,
        },
      })

      await redis.set(sessionKey, jwt, "EX", oneDayTTL)

      await setCookie(c, cookiesKeys.auth.session, jwt)

      return c.json(
        { message: authMessages.signInSuccess.message },
        SC.success.OK
      )
    }
  )

  signIn.get("/me", auth, async (c: Context): Promise<Response> => {
    const contextUser: UserModel = c.get(contextsKeys.user)

    if (!contextUser) {
      return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
    }

    const user = await UserModel.query()
      .findOne({ email: contextUser.email })
      .withGraphFetched("roleData")

    if (!user) {
      return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
    }

    return c.json(
      {
        message: authMessages.signedInUser.message,
        result: sanitizeUser(user, ["id", "bio", "link", "location", "avatar"]),
      },
      SC.success.OK
    )
  })

  signIn.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/auth", signIn)
}

export default prepareSignInRoutes
