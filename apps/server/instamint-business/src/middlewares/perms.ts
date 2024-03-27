import { createFactory, type Factory } from "hono/factory"
import type { Context, MiddlewareHandler, Next } from "hono"

import { createErrorResponse } from "@/utils/errors/createErrorResponse"
import type UserModel from "@/db/models/UserModel"

const factory: Factory = createFactory()

export const isAdmin: MiddlewareHandler = factory.createMiddleware(
  async (c: Context, next: Next) => {
    const user: UserModel = c.get("user")

    if (!user || user.roleData.right !== "admin") {
      throw createErrorResponse(
        "You don't have permission to access this resource",
        403
      )
    }

    await next()
  }
)
