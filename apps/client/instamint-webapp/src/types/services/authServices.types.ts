import type {
  SignIn,
  SignUp,
  TwoFactorSignIn,
  TwoFactorSignInWithBackupCode,
  UserEmailToken,
  UserResendEmail,
} from "@instamint/shared-types"

export type AuthServices = {
  signUp: [SignUp, null]
  emailValidation: [UserEmailToken, null]
  resendEmailValidation: [UserResendEmail, null]
  signIn: [SignIn, null]
  signIn2fa: [TwoFactorSignIn, null]
  signIn2faBackupCode: [TwoFactorSignInWithBackupCode, null]
  signOut: [null, null]
}
