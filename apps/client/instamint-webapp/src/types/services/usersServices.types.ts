import type {
  ConfirmResetPassword,
  RequestResetPassword,
  UserInfos,
  DeleteAccount,
  ReactivateAccount,
  TwoFactorGenerateResult,
  ActivateTwoFactorAuthResult,
  TwoFactorAuthenticate,
  ModifyPassword,
  ModifyEmail,
  UserAvatar,
} from "@instamint/shared-types"

export type UsersServices = {
  requestResetPassword: [RequestResetPassword, null]
  confirmResetPassword: [ConfirmResetPassword, null]
  updateUserInfos: [UserInfos, null]
  deleteAccount: [DeleteAccount, null]
  reactivateAccount: [ReactivateAccount, null]
  twoFactorCodeGeneration: [null, TwoFactorGenerateResult]
  twoFactorActivation: [string, ActivateTwoFactorAuthResult]
  twoFactorAuthentication: [TwoFactorAuthenticate, null]
  twoFactorDeactivation: [string, null]
  modifyPassword: ModifyPassword
  modifyEmail: ModifyEmail
  uploadAvatar: UserAvatar
}
