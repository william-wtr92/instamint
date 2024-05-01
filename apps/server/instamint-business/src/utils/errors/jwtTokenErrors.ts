import { SC } from "@instamint/server-types"

import { globalsMessages } from "@/def"
import { throwInternalError } from "@/utils/errors/throwInternalError"

export const jwtTokenErrors = <T>(err: T) => {
  if (err instanceof Error && err.name === "JwtTokenSignatureMismatched") {
    throw throwInternalError(
      globalsMessages.tokenSignatureMismatched,
      SC.errors.UNAUTHORIZED
    )
  } else if (err instanceof Error && err.name === "JwtTokenInvalid") {
    throw throwInternalError(
      globalsMessages.tokenInvalidStructure,
      SC.errors.UNAUTHORIZED
    )
  } else if (err instanceof Error && err.name === "JwtTokenExpired") {
    throw throwInternalError(
      globalsMessages.tokenExpired,
      SC.errors.UNAUTHORIZED
    )
  }

  throw throwInternalError(
    globalsMessages.unspecifiedErrorOccurred,
    SC.serverErrors.INTERNAL_SERVER_ERROR
  )
}
