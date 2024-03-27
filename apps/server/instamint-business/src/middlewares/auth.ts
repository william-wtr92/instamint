import { createFactory, type Factory } from "hono/factory"
import type { Context, MiddlewareHandler, Next } from "hono"
import { verify } from "hono/jwt"

import appConfig from "@/db/config/config"
import UserModel from "@/db/models/UserModel"
import { jwtTokenErrors } from "@/utils/errors/jwtTokenErrors"
import {
  tokenInvalidStructure,
  tokenNotProvided,
  userNotFound,
} from "@/utils/messages"

const factory: Factory = createFactory()

export const auth: MiddlewareHandler = factory.createMiddleware(
  async (c: Context, next: Next) => {
    const jwt = c.req.header("Authorization")?.slice(7)

    if (!jwt) {
      return c.json({ message: tokenNotProvided }, 401)
    }

    try {
      const decodedToken = await verify(
        jwt,
        appConfig.security.jwt.secret,
        "HS512"
      )

      if (
        typeof decodedToken === "object" &&
        decodedToken !== null &&
        "payload" in decodedToken &&
        "user" in decodedToken.payload
      ) {
        const userId: number = decodedToken.payload.user.id

        const user: UserModel | undefined = await UserModel.query()
          .withGraphFetched("roleData")
          .findById(userId)

        if (!user) {
          return c.json({ message: userNotFound }, 404)
        }

        c.set("user", user)

        await next()
      }

      return c.json({ message: tokenInvalidStructure }, 401)
    } catch (err) {
      throw jwtTokenErrors(err)
    }
  }
)
