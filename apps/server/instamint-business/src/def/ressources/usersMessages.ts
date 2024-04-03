/* Reset Passwords */
export const passwordsMustMatch = {
  errorCode: "passwordsMustMatch",
  message: "Passwords must match.",
} as const

export const passwordUpdated = {
  message: "Password updated.",
} as const

export const userMustWaitBeforeResettingPassword = {
  errorCode: "userMustWaitBeforeResettingPassword",
  message:
    "You have reset your password less than 2 days ago. Try again later.",
} as const

export const newPasswordMustBeDifferentFromOldOne = {
  errorCode: "newPasswordMustBeDifferentFromOldOne",
  message: "The new password must be different from the old one.",
} as const
