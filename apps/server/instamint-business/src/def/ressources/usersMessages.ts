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

/* Delete Account */
export const deletedAccount = {
  message: "Account deleted.",
} as const

export const deletedAccountJob = {
  message: "Accounts with an expired deletion date have been deleted .",
} as const

export const accountAlreadyDeactivated = {
  errorCode: "accountAlreadyDeactivated",
  message: "Account already deactivated.",
} as const

/* Reactivate Account */
export const reactivateAccountDateExpired = {
  errorCode: "reactivateAccountDateExpired",
  message: "The reactivation date has expired.",
} as const

export const reactivatedAccount = {
  message: "Account reactivated.",
} as const

export const accountAlreadyActivated = {
  errorCode: "accountAlreadyActive",
  message: "Account already active.",
} as const

export const reactivateAccountEmailMismatch = {
  errorCode: "reactivateAccountEmailMismatch",
  message: "Email does not match the reactivation email.",
} as const
