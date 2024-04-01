import type { PrepareServicesContext } from "@/types"

import signUpService from "@/web/services/auth/signUpService"
import emailValidationService from "@/web/services/auth/emailValidationService"
import resendEmailValidationService from "@/web/services/auth/resendEmailValidationService"
import signInService from "@/web/services/auth/signInServices"

import requestResetPasswordService from "@/web/services/users/reset/requestResetPasswordService"
import confirmResetPasswordService from "@/web/services/users/reset/confirmResetPasswordService"

export const prepareServices: PrepareServicesContext = (context) => {
  return {
    services: {
      auth: {
        signUp: signUpService(context),
        emailValidation: emailValidationService(context),
        resendEmailValidation: resendEmailValidationService(context),
        signIn: signInService(context),
      },
      users: {
        requestResetPassword: requestResetPasswordService(context),
        confirmResetPassword: confirmResetPasswordService(context),
      },
    },
  }
}
