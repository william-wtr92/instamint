import { PrepareServicesContext } from "@/types"

import signupService from "@/web/services/users/signupService"
import emailValidationService from "@/web/services/users/emailValidationService"
import resendEmailValidationService from "@/web/services/users/resendEmailValidationService"

export const prepareServices: PrepareServicesContext = ({ api }) => {
  return {
    services: {
      users: {
        signup: signupService({ api }),
        emailValidation: emailValidationService({ api }),
        resendEmailValidation: resendEmailValidationService({ api }),
      },
    },
  }
}
