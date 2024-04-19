import type {
  ConfirmResetPassword,
  RequestResetPassword,
  UserInfosSchema,
  DeleteAccount,
  ReactivateAccount,
  ConfirmModifyPassword,
} from "@instamint/shared-types"

export type UsersServices = {
  requestResetPassword: RequestResetPassword
  confirmResetPassword: ConfirmResetPassword
  updateUserInfos: UserInfosSchema
  deleteAccount: DeleteAccount
  reactivateAccount: ReactivateAccount
  modifyPassword: ConfirmModifyPassword
}
