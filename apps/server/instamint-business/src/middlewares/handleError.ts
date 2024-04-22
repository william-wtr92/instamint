import type { Context } from "hono"
import { HTTPException } from "hono/http-exception"
import { SC } from "@instamint/server-types"

import { createErrorResponse } from "@/utils/errors/createErrorResponse"
import { globalsMessages } from "@/def"

export const handleError = async (e: Error, c: Context): Promise<Response> => {
  let errorMessage = globalsMessages.unspecifiedErrorOccurred
  let statusCode: number = SC.serverErrors.INTERNAL_SERVER_ERROR

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
