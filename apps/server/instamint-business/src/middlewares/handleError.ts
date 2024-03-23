import { Context } from "hono"
import { HTTPException } from "hono/http-exception"

import { createErrorResponse } from "@/utils/errors"

const BASE_MESSAGE: string = "An unspecified error occurred"

export const handleError = async (e: Error, c: Context): Promise<Response> => {
  let errorMessage = BASE_MESSAGE
  let statusCode = 500

  if (e instanceof HTTPException && e.res) {
    const body = await e.res.text()
    const errorDetails = JSON.parse(body)

    errorMessage = errorDetails.message || errorMessage
    statusCode = e.res.status
  } else {
    errorMessage = e.message || errorMessage
  }

  const sentry = c.get("sentry")

  if (sentry) {
    sentry.captureException(new Error(errorMessage))
  }

  throw createErrorResponse(errorMessage, statusCode)
}
