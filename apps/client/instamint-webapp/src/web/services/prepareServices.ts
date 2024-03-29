import type { PrepareServicesContext } from "@/types"

import signUpService from "@/web/services/users/signUpService"
import emailValidationService from "@/web/services/users/emailValidationService"
import resendEmailValidationService from "@/web/services/users/resendEmailValidationService"

export const prepareServices: PrepareServicesContext = (context) => {
  return {
    services: {
      users: {
        signUp: signUpService(context),
        emailValidation: emailValidationService(context),
        resendEmailValidation: resendEmailValidationService(context),
      },
    },
  }
}
