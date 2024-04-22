import type { UserResendEmail } from "@instamint/shared-types"

import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"
import type { Services } from "@/types"

const resendEmailValidationService: Services<UserResendEmail> =
  ({ api }) =>
  async (data) => {
    try {
      const body = {
        email: data.email,
      }

      const { data: responseData } = await api.post(
        routes.api.auth.resendEmailValidation,
        body
      )

      return [null, responseData]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default resendEmailValidationService
