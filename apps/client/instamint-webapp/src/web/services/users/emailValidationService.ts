import type { UserEmailToken } from "@instamint/shared-types"

import { routes } from "@/web/routes"
import { handleError } from "@/web/utils/handleError"
import type { Services } from "@/types"

const emailValidationService: Services<UserEmailToken> =
  ({ api }) =>
  async (data) => {
    try {
      const body = {
        validation: data.validation,
      }

      const { data: responseData } = await api.post(
        routes.users.emailValidation,
        body
      )

      return [null, responseData]
    } catch (err) {
      return [handleError(err)]
    }
  }

export default emailValidationService
