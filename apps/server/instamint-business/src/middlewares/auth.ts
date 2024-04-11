import { createFactory, type Factory } from "hono/factory"
import type { Context, MiddlewareHandler, Next } from "hono"
import { SC } from "@instamint/server-types"

import { globalsMessages, authMessages, cookiesKeys, contextsKeys } from "@/def"
import UserModel from "@/db/models/UserModel"
import { jwtTokenErrors } from "@/utils/errors/jwtTokenErrors"
import { sanitizeUser } from "@/utils/dto/sanitizeUsers"
import { decodeJwt } from "@/utils/helpers/jwtActions"
import { getCookie } from "@/utils/helpers/cookiesActions"

const factory: Factory = createFactory()

export const auth: MiddlewareHandler = factory.createMiddleware(
  async (c: Context, next: Next) => {
    const authToken = await getCookie(c, cookiesKeys.auth.session)

    if (!authToken) {
      return c.json(globalsMessages.tokenNotProvided, SC.errors.UNAUTHORIZED)
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
          return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
        }

        c.set(contextsKeys.user, sanitizeUser(user, ["roleData", "id"]))

        await next()
      }

      return c.json(
        globalsMessages.tokenInvalidStructure,
        SC.errors.UNAUTHORIZED
      )
    } catch (err) {
      throw jwtTokenErrors(err)
    }
  }
)
