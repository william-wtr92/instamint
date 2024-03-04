import { createFactory, Factory } from "hono/factory"
import { Context, MiddlewareHandler, Next } from "hono"

import { createErrorResponse } from "@/utils/errors"
import UserModel from "@/db/models/UserModel"

const factory: Factory = createFactory()

export const perms: MiddlewareHandler = factory.createMiddleware(
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
