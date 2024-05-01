import type {
  SignIn,
  SignUp,
  TwoFactorSignIn,
  UserEmailToken,
  UserResendEmail,
} from "@instamint/shared-types"

export type AuthServices = {
  signUp: [SignUp, null]
  emailValidation: [UserEmailToken, null]
  resendEmailValidation: [UserResendEmail, null]
  signIn: [SignIn, null]
  signIn2fa: [TwoFactorSignIn, null]
  signOut: [null, null]
}
