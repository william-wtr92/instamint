import type {
  SignIn,
  SignUp,
  TwoFactorGenerateResult,
  UserEmailToken,
  UserResendEmail,
} from "@instamint/shared-types"

export type AuthServices = {
  signUp: SignUp
  emailValidation: UserEmailToken
  resendEmailValidation: UserResendEmail
  signIn: SignIn
  signOut: null
  twoFactorCodeGeneration: TwoFactorGenerateResult
  twoFactorActivation: string
}
