import type {
  ConfirmResetPassword,
  RequestResetPassword,
  UserInfosSchema,
  DeleteAccount,
  ReactivateAccount,
  TwoFactorGenerateResult,
} from "@instamint/shared-types"

export type UsersServices = {
  requestResetPassword: [RequestResetPassword, null]
  confirmResetPassword: [ConfirmResetPassword, null]
  updateUserInfos: [UserInfosSchema, null]
  deleteAccount: [DeleteAccount, null]
  reactivateAccount: [ReactivateAccount, null]
  twoFactorCodeGeneration: [null, TwoFactorGenerateResult]
  twoFactorActivation: [string, null]
}
