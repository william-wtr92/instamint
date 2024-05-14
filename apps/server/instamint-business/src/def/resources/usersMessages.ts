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

export const deleteAccountJob = (email: string) => {
  return {
    errorCode: "deleteAccountJob",
    message: `Error deleting account for: ${email}.`,
  } as const
}

/* Update Account */
export const userNotModified = {
  errorCode: "userNotModified",
  message: "Error update account.",
} as const

export const usernameAlreadyExist = {
  errorCode: "usernameAlreadyExist",
  message: "Error this username already exist.",
} as const

export const linkAlreadyExist = {
  errorCode: "linkAlreadyExist",
  message: "Error this link already exist.",
} as const

/* modify password */
export const passwordSameAsPrevious = {
  errorCode: "passwordSameAsPrevious",
  message: "You need a different password.",
} as const

export const passwordAlreadyModify = {
  errorCode: "passwordAlreadyModify",
  message: "You have already changed your password within the last 24 hours.",
} as const

/* Modify Email */
export const emailSameAsPrevious = {
  errorCode: "emailSameAsPrevious",
  message: "You need a different email.",
} as const

export const emailAlreadyModify = {
  errorCode: "emailAlreadyModify",
  message: "You have already changed your email within the last 24 hours.",
} as const

export const emailAlreadyUse = {
  errorCode: "emailAlreadyUse",
  message: "This email is already use for an account.",
} as const

export const invalidEmail = {
  errorCode: "invalidEmail",
  message: "Invalid email.",
} as const

/* Avatar */
export const avatarSizeTooLarge = {
  errorCode: "avatarSizeTooLarge",
  message: "Avatar size too large.",
} as const

export const avatarUploadFailed = {
  errorCode: "avatarUploadFailed",
  message: "Avatar upload failed.",
} as const

export const avatarUploaded = {
  message: "Avatar uploaded.",
} as const

export const avatarDeleteFailed = {
  errorCode: "avatarDeleteFailed",
  message: "Avatar delete failed.",
} as const

export const avatarDeleted = {
  message: "Avatar deleted.",
} as const