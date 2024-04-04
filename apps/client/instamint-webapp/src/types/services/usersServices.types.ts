import type {
  ConfirmResetPassword,
  RequestResetPassword,
  DeleteAccount,
  ReactivateAccount,
} from "@instamint/shared-types"

export type UsersServices = {
  requestResetPassword: RequestResetPassword
  confirmResetPassword: ConfirmResetPassword
  deleteAccount: DeleteAccount
  reactivateAccount: ReactivateAccount
}
