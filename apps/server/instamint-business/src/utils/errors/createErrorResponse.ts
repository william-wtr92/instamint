import { HTTPException } from "hono/http-exception"
import type { StatusCode, SimpleHeaders } from "@instamint/server-types"

export const createErrorResponse = (
  error: object,
  statusCode: number,
  headers?: SimpleHeaders
): HTTPException => {
  const responseHeaders = new Headers(headers)

  responseHeaders.set("Content-Type", "application/json")

  const responseBody = JSON.stringify(error)

  const errorResponse = new Response(responseBody, {
    status: statusCode,
    headers: responseHeaders,
  })

  return new HTTPException(statusCode as StatusCode, { res: errorResponse })
}
