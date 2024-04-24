import { SC } from "@instamint/server-types"
import type { Context, MiddlewareHandler, Next } from "hono"
import { createFactory, type Factory } from "hono/factory"

import appConfig from "@/db/config/config"
import { contextsKeys, globalsMessages, redisKeys } from "@/def"
import { jwtTokenErrors } from "@/utils/errors/jwtTokenErrors"
import { decodeJwt } from "@/utils/helpers/jwtActions"
import { redis } from "@/utils/redis/instance"

const factory: Factory = createFactory()

export const deleteAccountJob: MiddlewareHandler = factory.createMiddleware(
  async (c: Context, next: Next) => {
    const deleteAccountKey = redisKeys.cron.deleteAccountToken
    const deleteAccountToken = await redis.get(deleteAccountKey)

    if (!deleteAccountToken) {
      return c.json(globalsMessages.tokenExpired, SC.errors.UNAUTHORIZED)
    }

    try {
      const decodedToken = await decodeJwt(
        deleteAccountToken,
        appConfig.security.jwt.cron.secret
      )

      if (
        typeof decodedToken === "object" &&
        decodedToken !== null &&
        "payload" in decodedToken &&
        "scope" in decodedToken
      ) {
        const scope = decodedToken.scope

        if (scope !== appConfig.security.jwt.cron.scopes.deleteAccount) {
          return c.json(
            globalsMessages.tokenInvalidScope,
            SC.errors.UNAUTHORIZED
          )
        }

        c.set(contextsKeys.cron.deleteAccount, deleteAccountKey)

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
