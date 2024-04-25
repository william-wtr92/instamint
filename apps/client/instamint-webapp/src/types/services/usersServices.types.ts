import type {
  ConfirmResetPassword,
  RequestResetPassword,
  UserInfosSchema,
  DeleteAccount,
  ReactivateAccount,
  TwoFactorGenerateResult,
} from "@instamint/shared-types"

export type UsersServices = {
  requestResetPassword: RequestResetPassword
  confirmResetPassword: ConfirmResetPassword
  updateUserInfos: UserInfosSchema
  deleteAccount: DeleteAccount
  reactivateAccount: ReactivateAccount
  twoFactorCodeGeneration: TwoFactorGenerateResult
  twoFactorActivation: string
}
