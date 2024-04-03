import type {
  ConfirmResetPassword,
  RequestResetPassword,
} from "@instamint/shared-types"

export type UsersServices = {
  requestResetPassword: RequestResetPassword
  confirmResetPassword: ConfirmResetPassword
}
