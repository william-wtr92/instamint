import type { Context } from "hono"
import { HTTPException } from "hono/http-exception"

import { createErrorResponse } from "@/utils/errors/createErrorResponse"
import { unspecifiedErrorOccurred } from "@/def/messages"

export const handleError = async (e: Error, c: Context): Promise<Response> => {
  let errorMessage = unspecifiedErrorOccurred
  let statusCode = 500

  if (e instanceof HTTPException && e.res) {
    const body = await e.res.text()
    const errorDetails = JSON.parse(body)

    errorMessage = errorDetails || errorMessage
    statusCode = e.res.status
  }

  const sentry = c.get("sentry")

  if (sentry) {
    sentry.captureException(new Error(errorMessage.message))
  }

  throw createErrorResponse(errorMessage, statusCode)
}
