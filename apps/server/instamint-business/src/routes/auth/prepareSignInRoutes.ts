import { type Context, Hono } from "hono"
import { setSignedCookie } from "hono/cookie"
import { zValidator } from "@hono/zod-validator"
import type { ApiRoutes } from "@instamint/server-types"
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
    throw createErrorResponse(globalsMessages.databaseNotAvailable, 500)
  }

  if (!redis) {
    throw createErrorResponse(globalsMessages.redisNotAvailable, 500)
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
        return c.json(authMessages.emailNotExists, 400)
      }

      const validity = await user?.checkPassword(password)

      if (!validity) {
        return c.json(authMessages.invalidPassword, 400)
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

      return c.json({ message: authMessages.signInSuccess.message }, 200)
    }
  )

  signIn.get("/me", auth, async (c: Context): Promise<Response> => {
    const contextUser: UserModel = c.get(contextsKeys.user)

    if (!contextUser) {
      return c.json(authMessages.userNotFound, 404)
    }

    return c.json(
      {
        message: authMessages.signedInUser.message,
        user: sanitizeUser(contextUser),
      },
      200
    )
  })

  signIn.get(
    "/test-perms",
    auth,
    isAdmin,
    async (c: Context): Promise<Response> => {
      return c.json({
        message: "You are an admin!",
      })
    }
  )

  signIn.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/auth", signIn)
}

export default prepareSignInRoutes
