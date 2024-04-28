import type { PrepareServicesContext } from "@/types"

import signUpService from "@/web/services/auth/signUpService"
import emailValidationService from "@/web/services/auth/emailValidationService"
import resendEmailValidationService from "@/web/services/auth/resendEmailValidationService"
import signInService from "@/web/services/auth/signInService"
import signOutService from "@/web/services/auth/signOutService"

import requestResetPasswordService from "@/web/services/users/account/reset/requestResetPasswordService"
import confirmResetPasswordService from "@/web/services/users/account/reset/confirmResetPasswordService"
import updateUserInfosService from "@/web/services/users/account/updateUserInfosService"
import deleteAccountService from "@/web/services/users/account/deleteAccountService"
import reactivateAccountService from "@/web/services/users/account/reactivateAccountService"
import twoFactorCodeGenerationService from "@/web/services/users/account/twoFactorCodeGenerationService"
import twoFactorActivationService from "@/web/services/users/account/twoFactorActivationService"
import twoFactorAuthenticationService from "./users/account/twoFactorAuthenticationService"
import { twoFactorDeactivationService } from "./users/account/twoFactorDeactivationService"

export const prepareServices: PrepareServicesContext = (context) => {
  return {
    services: {
      auth: {
        signUp: signUpService(context),
        emailValidation: emailValidationService(context),
        resendEmailValidation: resendEmailValidationService(context),
        signIn: signInService(context),
        signOut: signOutService(context),
      },
      users: {
        requestResetPassword: requestResetPasswordService(context),
        confirmResetPassword: confirmResetPasswordService(context),
        updateUserInfos: updateUserInfosService(context),
        deleteAccount: deleteAccountService(context),
        reactivateAccount: reactivateAccountService(context),
        twoFactorCodeGeneration: twoFactorCodeGenerationService(context),
        twoFactorActivation: twoFactorActivationService(context),
        twoFactorAuthentication: twoFactorAuthenticationService(context),
        twoFactorDeactivation: twoFactorDeactivationService(context),
      },
    },
  }
}
