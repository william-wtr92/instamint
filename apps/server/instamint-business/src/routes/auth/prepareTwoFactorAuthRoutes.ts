import {
  // type Context,
  Hono,
} from "hono"
// import { zValidator } from "@hono/zod-validator"
import { type ApiRoutes, SC } from "@instamint/server-types"

import {
  globalsMessages,
  // authMessages,
  // redisKeys,
  // cookiesKeys,
  // contextsKeys,
  // usersMessages,
} from "@/def"
import { createErrorResponse } from "@/utils/errors/createErrorResponse"
// import { auth } from "@/middlewares/auth"
// import UserModel from "@/db/models/UserModel"
// import { generateSecret } from "@/utils/helpers/twoFactorAuthActions"

const prepareTwoFactorAuthRoutes: ApiRoutes = ({ app, db, redis }) => {
  const twoFactorAuth = new Hono()

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

  // twoFactorAuth.post(
  //   "/generate",
  //   auth,
  //   async (c: Context): Promise<Response> => {
  //     const contextUser: UserModel = c.get(contextsKeys.user)
  //     const user = await UserModel.query().findOne({ email: contextUser.email })

  //     if (!user) {
  //       return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
  //     }

  //     if (!user.active) {
  //       return c.json(
  //         usersMessages.accountAlreadyDeactivated,
  //         SC.errors.BAD_REQUEST
  //       )
  //     }

  //     if (user.twoFactorAuthentication) {
  //       return c.json(
  //         authMessages.twoFactorAuthAlreadyEnabled,
  //         SC.errors.BAD_REQUEST
  //       )
  //     }

  //     const secret = generateSecret()

  //     const
  //   }
  // )

  app.route("/auth/2fa", twoFactorAuth)
}

export default prepareTwoFactorAuthRoutes
