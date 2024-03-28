import { createErrorResponse } from "@/utils/errors/createErrorResponse"
import {
  tokenExpired,
  tokenInvalidStructure,
  tokenSignatureMismatched,
  unspecifiedErrorOccurred,
} from "@/def/messages"

export const jwtTokenErrors = <T>(err: T) => {
  if (err instanceof Error && err.name == "JwtTokenSignatureMismatched") {
    throw createErrorResponse(tokenSignatureMismatched, 401)
  } else if (err instanceof Error && err.name == "JwtTokenInvalid") {
    throw createErrorResponse(tokenInvalidStructure, 401)
  } else if (err instanceof Error && err.name == "JwtTokenExpired") {
    throw createErrorResponse(tokenExpired, 401)
  }

  throw createErrorResponse(unspecifiedErrorOccurred, 500)
}