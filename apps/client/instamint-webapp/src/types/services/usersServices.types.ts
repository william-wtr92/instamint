import type {
  ConfirmResetPassword,
  RequestResetPassword,
  UsernameEmailSettingsSchema,
} from "@instamint/shared-types"

export type UsersServices = {
  requestResetPassword: RequestResetPassword
  confirmResetPassword: ConfirmResetPassword
  userGetInformation: UsernameEmailSettingsSchema
  userUpdateInformation: UsernameEmailSettingsSchema
}
