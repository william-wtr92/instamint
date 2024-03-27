import type {
  SignUp,
  UserEmailToken,
  UserResendEmail,
} from "@instamint/shared-types"

export type UsersServices = {
  signUp: SignUp
  emailValidation: UserEmailToken
  resendEmailValidation: UserResendEmail
}
