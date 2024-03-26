import {
  SignUp,
  UserEmailToken,
  UserResendEmail,
} from "@instamint/shared-types"

export type UsersServices = {
  signup: SignUp
  emailValidation: UserEmailToken
  resendEmailValidation: UserResendEmail
}
