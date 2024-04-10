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
  userGetInformation: UsernameEmailSettingsSchema
  userUpdateInformation: UsernameEmailSettingsSchema
  deleteAccount: DeleteAccount
  reactivateAccount: ReactivateAccount
}
