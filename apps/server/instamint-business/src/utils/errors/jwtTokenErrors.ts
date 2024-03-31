import { SC } from "@instamint/server-types"

import { createErrorResponse } from "@/utils/errors/createErrorResponse"
import { globalsMessages } from "@/def"

export const jwtTokenErrors = <T>(err: T) => {
  if (err instanceof Error && err.name == "JwtTokenSignatureMismatched") {
    throw createErrorResponse(
      globalsMessages.tokenSignatureMismatched,
      SC.errors.UNAUTHORIZED
    )
  } else if (err instanceof Error && err.name == "JwtTokenInvalid") {
    throw createErrorResponse(
      globalsMessages.tokenInvalidStructure,
      SC.errors.UNAUTHORIZED
    )
  } else if (err instanceof Error && err.name == "JwtTokenExpired") {
    throw createErrorResponse(
      globalsMessages.tokenExpired,
      SC.errors.UNAUTHORIZED
    )
  }

  throw createErrorResponse(
    globalsMessages.unspecifiedErrorOccurred,
    SC.serverErrors.INTERNAL_SERVER_ERROR
  )
}
