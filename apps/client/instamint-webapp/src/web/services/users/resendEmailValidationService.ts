import type { UserResendEmail } from "@instamint/shared-types"

import { routes } from "@/web/routes"
import { handleError } from "@/web/utils/handleError"
import type { Services } from "@/types"

const resendEmailValidationService: Services<UserResendEmail> =
  ({ api }) =>
  async (data) => {
    try {
      const body = {
        email: data.email,
      }

      const { data: responseData } = await api.post(
        routes.users.resendEmailValidation,
        body
      )

      return [null, responseData]
    } catch (err) {
      return [handleError(err)]
    }
  }

export default resendEmailValidationService
