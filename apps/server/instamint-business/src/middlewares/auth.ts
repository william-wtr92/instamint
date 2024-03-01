import { createFactory, Factory } from "hono/factory"
import { Context, MiddlewareHandler, Next } from "hono"
import { verify } from "hono/jwt"

import configDb from "@/db/config/config"
import UserModel from "@/db/models/UserModel"
import { createErrorResponse } from "@/utils/errors"

const factory: Factory = createFactory()

export const auth: MiddlewareHandler = factory.createMiddleware(
  async (c: Context, next: Next) => {
    const jwt = c.req.header("Authorization")?.slice(7)

    if (!jwt) {
      return c.json({ message: "No token provided", ok: false }, 401)
    }

    try {
      const decodedToken = await verify(
        jwt,
        configDb.security.jwt.secret,
        "HS512",
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
          return c.json({ message: "User not found", ok: false }, 404)
        }

        c.set("user", user)

        await next()
      }

      return c.json({ message: "Invalid token structure", ok: false }, 401)
    } catch (err) {
      if (err instanceof Error && err.name == "JwtTokenSignatureMismatched") {
        throw createErrorResponse("Invalid token - Signature Mismatched", 401)
      } else if (err instanceof Error && err.name == "JwtTokenInvalid") {
        throw createErrorResponse("Invalid token Structure", 401)
      } else if (err instanceof Error && err.name == "JwtTokenExpired") {
        throw createErrorResponse("Token has expired", 401)
      }

      throw createErrorResponse("An error occurred", 500)
    }
  },
)
