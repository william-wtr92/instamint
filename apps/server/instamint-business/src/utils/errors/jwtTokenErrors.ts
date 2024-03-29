import { createErrorResponse } from "@/utils/errors/createErrorResponse"
import { globalsMessages } from "@/def"

export const jwtTokenErrors = <T>(err: T) => {
  if (err instanceof Error && err.name == "JwtTokenSignatureMismatched") {
    throw createErrorResponse(globalsMessages.tokenSignatureMismatched, 401)
  } else if (err instanceof Error && err.name == "JwtTokenInvalid") {
    throw createErrorResponse(globalsMessages.tokenInvalidStructure, 401)
  } else if (err instanceof Error && err.name == "JwtTokenExpired") {
    throw createErrorResponse(globalsMessages.tokenExpired, 401)
  }

  throw createErrorResponse(globalsMessages.unspecifiedErrorOccurred, 500)
}
