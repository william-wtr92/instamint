import { SC } from "@instamint/server-types"
import type { Context, MiddlewareHandler, Next } from "hono"
import { createFactory, type Factory } from "hono/factory"

import type UserModel from "@/db/models/UserModel"
import { authMessages } from "@/def"
import { createErrorResponse } from "@/utils/errors/createErrorResponse"

const factory: Factory = createFactory()

export const isAdmin: MiddlewareHandler = factory.createMiddleware(
  async (c: Context, next: Next) => {
    const user: UserModel = c.get("user")

    if (!user || user.roleData.right !== "admin") {
      throw createErrorResponse(
        authMessages.notHavePermission,
        SC.errors.FORBIDDEN
      )
    }

    await next()
  }
)
