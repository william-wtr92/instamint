import type { PrepareServicesContext } from "@/types"

import signUpService from "@/web/services/auth/signUpService"
import emailValidationService from "@/web/services/auth/emailValidationService"
import resendEmailValidationService from "@/web/services/auth/resendEmailValidationService"
import signInService from "@/web/services/auth/signInService"
import signOutService from "@/web/services/auth/signOutService"

import requestResetPasswordService from "@/web/services/users/reset/requestResetPasswordService"
import confirmResetPasswordService from "@/web/services/users/reset/confirmResetPasswordService"
import updateFieldsAccountService from "@/web/services/users/account/updateUserInformation"
import deleteAccountService from "@/web/services/users/account/deleteAccountService"
import reactivateAccountService from "@/web/services/users/account/reactivateAccountService"

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
        updateFieldsAccount: updateFieldsAccountService(context),
        deleteAccount: deleteAccountService(context),
        reactivateAccount: reactivateAccountService(context),
      },
    },
  }
}
