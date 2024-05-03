import type {
  ConfirmResetPassword,
  RequestResetPassword,
  UserInfos,
  DeleteAccount,
  ReactivateAccount,
  ModifyPassword,
  ModifyEmail,
  UserAvatar,
} from "@instamint/shared-types"

export type UsersServices = {
  requestResetPassword: RequestResetPassword
  confirmResetPassword: ConfirmResetPassword
  updateUserInfos: UserInfos
  deleteAccount: DeleteAccount
  reactivateAccount: ReactivateAccount
  modifyPassword: ModifyPassword
  modifyEmail: ModifyEmail
  uploadAvatar: UserAvatar
}
