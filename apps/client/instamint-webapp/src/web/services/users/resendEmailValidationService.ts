import { UserResendEmail } from "@instamint/shared-types"

import { routes } from "@/web/routes"
import { handleError } from "@/web/utils/handleError"
import { Services } from "@/types"

const resendEmailValidationService: Services<UserResendEmail> =
  ({ api }) =>
  async (data) => {
    try {
      const { data: responseData } = await api.post(
        routes.users.resendEmailValidation,
        {
          email: data.email,
        }
      )

      return [null, responseData]
    } catch (err) {
      return [handleError(err)]
    }
  }

export default resendEmailValidationService
