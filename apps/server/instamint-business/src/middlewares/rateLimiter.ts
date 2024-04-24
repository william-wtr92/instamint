import { SC } from "@instamint/server-types"
import type { Context, Next } from "hono"
import { createFactory, type Factory } from "hono/factory"
import { RateLimiterMemory } from "rate-limiter-flexible"

import { globalsMessages } from "@/def"
import { createErrorResponse } from "@/utils/errors/createErrorResponse"

const factory: Factory = createFactory()

export const rateLimiter = (points: number, duration: number) => {
  const customOptions: RateLimiterMemory = new RateLimiterMemory({
    points: points || 100,
    duration: duration || 1000,
  })

  return factory.createMiddleware(async (c: Context, next: Next) => {
    const ip = c.req.header("x-forwarded-for")

    if (!ip) {
      return next()
    }

    try {
      await customOptions.consume(ip)
    } catch (e) {
      throw createErrorResponse(
        globalsMessages.toManyRequests,
        SC.errors.TOO_MANY_REQUESTS
      )
    }

    await next()
  })
}
