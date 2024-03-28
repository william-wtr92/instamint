/* GLOBALS MESSAGES */
export const databaseNotAvailable = {
  errorCode: "databaseNotAvailable",
  message: "Database not available",
} as const

export const redisNotAvailable = {
  errorCode: "redisNotAvailable",
  message: "Redis not available",
} as const

export const toManyRequests = {
  errorCode: "toManyRequests",
  message: "To many requests",
} as const

/* TOKEN MESSAGES */
export const tokenNotProvided = {
  errorCode: "tokenNotProvided",
  message: "No token provided",
} as const

export const tokenExpired = {
  errorCode: "tokenExpired",
  message: "Token has expired",
} as const

export const tokenInvalidStructure = {
  errorCode: "tokenInvalidStructure",
  message: "Token has invalid structure",
} as const

export const tokenSignatureMismatched = {
  errorCode: "tokenSignatureMismatched",
  message: "Token has invalid - signature mismatched",
} as const

/* GLOBAL MESSAGES */
export const unspecifiedErrorOccurred = {
  errorCode: "unspecifiedErrorOccurred",
  message: "An unspecified error occurred",
} as const

/* USERS MESSAGES */
export const emailOrUsernameAlreadyExist = {
  errorCode: "emailOrUsernameAlreadyExist",
  message: "Email or Username already exist",
} as const

export const emailNotExists = {
  errorCode: "emailNotExists",
  message: "Email not exists",
} as const

export const gdprValidationIsRequired = {
  errorCode: "gdprValidationIsRequired",
  message: "RGPD validation is required",
} as const

export const userCreated = {
  errorCode: "userCreated",
  message: "User created",
} as const

export const errorDuringUserRegistration = {
  errorCode: "errorDuringUserRegistration",
  message: "Error during user registration",
} as const

export const userNotFound = {
  errorCode: "userNotFound",
  message: "User not found",
} as const

export const userEmailValidated = {
  errorCode: "userEmailValidated",
  message: "Email validated",
} as const

export const userEmailAlreadyValidated = {
  errorCode: "userEmailAlreadyValidated",
  message: "Email already validated",
} as const

/* MAIL MESSAGES */
export const emailSent = {
  errorCode: "emailSent",
  message: "Email sent",
} as const

export const userMustWaitBeforeSendingAnotherMail = {
  errorCode: "userMustWaitBeforeSendingAnotherMail",
  message: "Please wait 10 minutes before trying again.",
} as const

/* AUTH MESSAGES */
export const notHavePermission = {
  errorCode: "notHavePermission",
  message: "You don't have permission",
} as const
