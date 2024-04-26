import type {
  SignIn,
  SignUp,
  UserEmailToken,
  UserResendEmail,
} from "@instamint/shared-types"

export type AuthServices = {
  signUp: [SignUp, null]
  emailValidation: [UserEmailToken, null]
  resendEmailValidation: [UserResendEmail, null]
  signIn: [SignIn, null]
  signOut: [null, null]
}
