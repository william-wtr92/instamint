import { createFactory, type Factory } from "hono/factory"
import type { Context, MiddlewareHandler, Next } from "hono"
import { getSignedCookie } from "hono/cookie"

import appConfig from "@/db/config/config"
import { globalsMessages, authMessages, cookiesKeys, contextsKeys } from "@/def"
import UserModel from "@/db/models/UserModel"
import { jwtTokenErrors } from "@/utils/errors/jwtTokenErrors"
import { sanitizeUser } from "@/utils/dto/sanitizeUsers"
import { decodeJwt } from "@/utils/helpers/jwtActions"

const factory: Factory = createFactory()

export const auth: MiddlewareHandler = factory.createMiddleware(
  async (c: Context, next: Next) => {
    const authToken = await getSignedCookie(
      c,
      appConfig.security.cookie.secret,
      cookiesKeys.auth.signIn
    )

    if (!authToken) {
      return c.json(globalsMessages.tokenNotProvided, 401)
    }

    try {
      const decodedToken = await decodeJwt(authToken)

      if (
        typeof decodedToken === "object" &&
        decodedToken !== null &&
        "payload" in decodedToken &&
        "user" in decodedToken.payload
      ) {
        const userId: number = decodedToken.payload.user.id

        const user = await UserModel.query()
          .withGraphFetched("roleData")
          .findById(userId)

        if (!user) {
          return c.json(authMessages.userNotFound, 404)
        }

        c.set(contextsKeys.user, sanitizeUser(user, ["roleData"]))

        await next()
      }

      return c.json(globalsMessages.tokenInvalidStructure, 401)
    } catch (err) {
      throw jwtTokenErrors(err)
    }
  }
)
