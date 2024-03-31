import { type Context, Hono } from "hono"
import { setSignedCookie } from "hono/cookie"
import { zValidator } from "@hono/zod-validator"
import { type ApiRoutes, SC } from "@instamint/server-types"
import { type SignIn, signInSchema } from "@instamint/shared-types"

import UserModel from "@/db/models/UserModel"
import {
  globalsMessages,
  authMessages,
  redisKeys,
  cookiesKeys,
  contextsKeys,
} from "@/def"
import appConfig from "@/db/config/config"
import { oneDayNotBasedOnNow } from "@/utils/helpers/times"
import { createErrorResponse } from "@/utils/errors/createErrorResponse"
import { handleError } from "@/middlewares/handleError"
import { auth } from "@/middlewares/auth"
import { isAdmin } from "@/middlewares/perms"
import { sanitizeUser } from "@/utils/dto/sanitizeUsers"
import { signJwt } from "@/utils/helpers/jwtActions"

const prepareSignInRoutes: ApiRoutes = ({ app, db, redis }) => {
  const signIn = new Hono()

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

      if (!user) {
        return c.json(authMessages.emailNotExists, SC.errors.NOT_FOUND)
      }

      const validity = await user?.checkPassword(password)

      if (!validity) {
        return c.json(authMessages.invalidPassword, SC.errors.BAD_REQUEST)
      }

      const jwtTokenKey = redisKeys.auth.authSession(email, "")

      const jwt = await signJwt({
        user: {
          id: user.id,
          email: user.email,
          role: user.roleData.right,
        },
      })

      await redis.set(jwtTokenKey, jwt, "EX", oneDayNotBasedOnNow)

      await setSignedCookie(
        c,
        cookiesKeys.auth.signIn,
        jwt,
        appConfig.security.cookie.secret,
        {
          maxAge: appConfig.security.cookie.maxAge,
          sameSite: "Strict",
          path: "/",
          httpOnly: true,
        }
      )

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

    return c.json(
      {
        message: authMessages.signedInUser.message,
        result: sanitizeUser(contextUser),
      },
      SC.success.OK
    )
  })

  signIn.get(
    "/test-perms",
    auth,
    isAdmin,
    async (c: Context): Promise<Response> => {
      return c.json(
        {
          message: "You are an admin!",
        },
        SC.success.OK
      )
    }
  )

  signIn.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/auth", signIn)
}

export default prepareSignInRoutes
