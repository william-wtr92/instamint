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
  ImagePublication,
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
  modifyPassword: [ModifyPassword, null]
  modifyEmail: [ModifyEmail, null]
  uploadAvatar: [UserAvatar, null]
  uploadPublication: [ImagePublication, null]
}
