import type {
  ConfirmResetPassword,
  RequestResetPassword,
  UsernameEmailSettingsSchema,
  DeleteAccount,
  ReactivateAccount,
} from "@instamint/shared-types"

export type UsersServices = {
  requestResetPassword: RequestResetPassword
  confirmResetPassword: ConfirmResetPassword
  updateFieldsAccount: UsernameEmailSettingsSchema
  deleteAccount: DeleteAccount
  reactivateAccount: ReactivateAccount
}
