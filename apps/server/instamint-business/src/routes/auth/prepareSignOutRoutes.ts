import { type ApiRoutes, SC } from "@instamint/server-types"
import { type Context, Hono } from "hono"

import type UserModel from "@/db/models/UserModel"
import {
  authMessages,
  contextsKeys,
  cookiesKeys,
  globalsMessages,
  redisKeys,
} from "@/def"
import { auth } from "@/middlewares/auth"
import { handleError } from "@/middlewares/handleError"
import { throwInternalError } from "@/utils/errors/throwInternalError"
import { delCookie } from "@/utils/helpers/actions/cookiesActions"

const prepareSignOutRoutes: ApiRoutes = ({ app, db, redis }) => {
  const signOut = new Hono()

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

  signOut.post("/sign-out", auth, async (c: Context): Promise<Response> => {
    const contextUser: UserModel = c.get(contextsKeys.user)

    if (!contextUser) {
      return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
    }

    await delCookie(c, cookiesKeys.auth.session)

    const sessionKey = redisKeys.auth.authSession(contextUser.email)
    await redis.del(sessionKey)

    return c.json(
      { message: authMessages.signOutSuccess.message },
      SC.success.OK
    )
  })

  signOut.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/auth", signOut)
}

export default prepareSignOutRoutes
