import { UserEmailToken } from "@instamint/shared-types"

import { routes } from "@/web/routes"
import { handleError } from "@/web/utils/handleError"
import { Services } from "@/types"

const emailValidationService: Services<UserEmailToken> =
  ({ api }) =>
  async (data) => {
    try {
      const { data: responseData } = await api.post(
        routes.users.emailValidation,
        {
          validation: data.validation,
        }
      )

      return [null, responseData]
    } catch (err) {
      return [handleError(err)]
    }
  }

export default emailValidationService
