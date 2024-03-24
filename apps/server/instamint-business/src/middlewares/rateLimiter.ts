import { createFactory, Factory } from "hono/factory"
import { Context, Next } from "hono"
import { RateLimiterMemory } from "rate-limiter-flexible"

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
      throw createErrorResponse("Too many requests", 429)
    }

    await next()
  })
}
