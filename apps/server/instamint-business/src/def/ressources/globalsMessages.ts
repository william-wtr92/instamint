/* GLOBALS MESSAGES */

export const databaseNotAvailable = {
  errorCode: "databaseNotAvailable",
  message: "Database not available.",
} as const

export const redisNotAvailable = {
  errorCode: "redisNotAvailable",
  message: "Redis not available.",
} as const

export const toManyRequests = {
  errorCode: "toManyRequests",
  message: "To many requests.",
} as const

/* DEFAULT MESSAGE */

export const unspecifiedErrorOccurred = {
  errorCode: "unspecifiedErrorOccurred",
  message: "An unspecified error occurred.",
} as const

/* TOKEN MESSAGES */

export const tokenNotProvided = {
  errorCode: "tokenNotProvided",
  message: "No token provided.",
} as const

export const tokenExpired = {
  errorCode: "tokenExpired",
  message: "Token has expired.",
} as const

export const tokenInvalidStructure = {
  errorCode: "tokenInvalidStructure",
  message: "Token has invalid structure.",
} as const

export const tokenSignatureMismatched = {
  errorCode: "tokenSignatureMismatched",
  message: "Token has invalid - signature mismatched.",
} as const

export const tokenInvalidScope = {
  errorCode: "tokenInvalidScope",
  message: "Token has invalid scope.",
} as const
