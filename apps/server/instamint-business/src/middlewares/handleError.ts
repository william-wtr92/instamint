import { SC } from "@instamint/server-types"
import type { Context } from "hono"
import { HTTPException } from "hono/http-exception"

import { globalsMessages } from "@/def"
import { throwInternalError } from "@/utils/errors/throwInternalError"

export const handleError = async (e: Error, c: Context): Promise<Response> => {
  const { message = e.message || globalsMessages.unspecifiedErrorOccurred } =
    e instanceof HTTPException && e.res ? JSON.parse(await e.res.text()) : {}

  const statusCode =
    e instanceof HTTPException && e.res
      ? e.res.status
      : SC.serverErrors.INTERNAL_SERVER_ERROR

  c.get("sentry")?.captureException(new Error(message))

  throw throwInternalError(message, statusCode)
}
