/* GENERIC  */
export const notHavePermission = {
  errorCode: "notHavePermission",
  message: "You don't have permission.",
} as const

export const userNotFound = {
  errorCode: "userNotFound",
  message: "User not found.",
} as const

export const emailNotExists = {
  errorCode: "emailNotExists",
  message: "Email not exists.",
} as const

/* SignUp Messages  */

export const emailOrUsernameAlreadyExist = {
  errorCode: "emailOrUsernameAlreadyExist",
  message: "Email or Username already exist.",
} as const

export const gdprValidationIsRequired = {
  errorCode: "gdprValidationIsRequired",
  message: "RGPD validation is required.",
} as const

export const userCreated = {
  message: "User created.",
} as const

export const errorDuringUserRegistration = {
  errorCode: "errorDuringUserRegistration",
  message: "Error during user registration.",
} as const

export const userEmailValidated = {
  message: "Email validated.",
} as const

export const userEmailAlreadyValidated = {
  errorCode: "userEmailAlreadyValidated",
  message: "Email already validated.",
} as const

/* SignIn Messages  */

export const invalidPassword = {
  errorCode: "invalidPassword",
  message: "Invalid password.",
} as const

export const signInSuccess = {
  message: "Sign in success.",
} as const

export const signedInUser = {
  message: "User signed in.",
} as const

export const errorInvalidTwoFactorCookie = {
  errorCode: "errorInvalidTwoFactorCookie",
  message: "Invalid two factor cookie.",
} as const

export const errorDuringSignIn = {
  errorCode: "errorDuringSignIn",
  message: "Error during sign in.",
} as const

export const errorTwoFactorAuthRequired = {
  errorCode: "errorTwoFactorAuthRequired",
  message: "Two factor authentication required.",
} as const

/* SignOut Messages  */
export const signOutSuccess = {
  message: "Sign out success.",
} as const

/* Two Factor Auth Messages  */
export const twoFactorAuthSuccess = {
  message: "Two factor authentication success.",
} as const

export const twoFactorAuthActivated = {
  message: "Two factor authentication successfully activated.",
} as const

export const twoFactorAuthDeactivated = {
  message: "Two factor authentication successfully deactivated.",
} as const

export const errorTwoFactorAuthAlreadyEnabled = {
  errorCode: "errorTwoFactorAuthAlreadyEnabled",
  message: "Two factor authentication already enabled.",
} as const

export const errorDuringHotpGeneration = {
  errorCode: "errorDuringHotpGeneration",
  message: "Error during HOTP generation.",
} as const

export const errorSecretOrCodeNotProvided = {
  errorCode: "errorSecretOrCodeNotProvided",
  message: "Secret or code not provided.",
} as const

export const errorHotpCounterNotAvailable = {
  errorCode: "errorHotpCounterNotAvailable",
  message: "HOTP counter not available.",
} as const

export const errorTwoFactorAuthCodeNotValid = {
  errorCode: "errorTwoFactorAuthCodeNotValid",
  message: "Two factor authentication code not valid.",
} as const

export const errorDuringTwoFactorAuthActivation = {
  errorCode: "errorDuringTwoFactorAuthActivation",
  message: "Error during two-factor authentication activation.",
} as const

export const errorTwoFactorAuthNotEnabled = {
  errorCode: "errorTwoFactorAuthNotEnabled",
  message: "Two factor authentication not enabled.",
} as const

export const errorDuringTwoFactorAuthDeactivation = {
  errorCode: "errorDuringTwoFactorAuthDeactivation",
  message: "Error during two-factor authentication deactivation.",
} as const

export const errorBackupCodeNotProvided = {
  errorCode: "errorBackupCodeNotProvided",
  message: "Backup code not provided.",
} as const

export const errorUserHasNoBackupCodes = {
  errorCode: "errorUserHasNoBackupCodes",
  message: "User has no backup codes.",
} as const

export const errorBackupCodeNotValid = {
  errorCode: "errorBackupCodeNotValid",
  message: "Backup code not valid.",
} as const

/* Publications messages */
export const publicationNotFound = {
  errorCode: "publicationNotFound",
  message: "Publication not found.",
} as const

export const publicationSuccessfullyLiked = {
  message: "Publication successfully liked.",
} as const

export const publicationSuccessfullyDisliked = {
  message: "Publication successfully disliked.",
} as const

/* Comments messages */
export const commentNotFound = {
  errorCode: "commentNotFound",
  message: "Comment not found.",
} as const

export const notAuthorizedToDeleteComment = {
  errorCode: "notAuthorizedToDeleteComment",
  message: "Not authorized to delete comment.",
} as const

export const commentContentRequired = {
  errorCode: "commentContentRequired",
  message: "Comment content required.",
} as const

export const commentsSuccessfullyAdded = {
  message: "Comment successfully added.",
} as const

export const commentSuccessfullyDeleted = {
  message: "Comment successfully deleted.",
} as const
