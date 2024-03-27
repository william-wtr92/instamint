import { HTTPException } from "hono/http-exception"

import type { StatusCode } from "@instamint/server-types"

type SimpleHeaders = { [key: string]: string }

export const createErrorResponse = (
  message: string,
  statusCode: number,
  headers?: SimpleHeaders
): HTTPException => {
  const responseHeaders = new Headers(headers)

  responseHeaders.set("Content-Type", "application/json")

  const responseBody = JSON.stringify({ message })

  const errorResponse = new Response(responseBody, {
    status: statusCode,
    headers: responseHeaders,
  })

  return new HTTPException(statusCode as StatusCode, { res: errorResponse })
}
