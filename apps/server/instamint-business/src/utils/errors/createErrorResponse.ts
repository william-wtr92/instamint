import { HTTPException } from "hono/http-exception"

import type { StatusCode } from "@instamint/server-types"

type SimpleHeaders = { [key: string]: string }

export const createErrorResponse = (
  error: object | string,
  statusCode: number,
  headers?: SimpleHeaders
): HTTPException => {
  const responseHeaders = new Headers(headers)

  responseHeaders.set("Content-Type", "application/json")

  let responseBody = ""

  if (typeof error === "string") {
    responseBody = JSON.stringify({ message: error })
  } else if (typeof error === "object" && "message" in error) {
    responseBody = JSON.stringify({ message: error.message })
  }

  const errorResponse = new Response(responseBody, {
    status: statusCode,
    headers: responseHeaders,
  })

  return new HTTPException(statusCode as StatusCode, { res: errorResponse })
}
