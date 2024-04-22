import type {
  ConfirmResetPassword,
  RequestResetPassword,
  UserInfosSchema,
  DeleteAccount,
  ReactivateAccount,
  ModifyPassword,
  ModifyEmail,
} from "@instamint/shared-types"

export type UsersServices = {
  requestResetPassword: RequestResetPassword
  confirmResetPassword: ConfirmResetPassword
  updateUserInfos: UserInfosSchema
  deleteAccount: DeleteAccount
  reactivateAccount: ReactivateAccount
  modifyPassword: ModifyPassword
  modifyEmail: ModifyEmail
}
