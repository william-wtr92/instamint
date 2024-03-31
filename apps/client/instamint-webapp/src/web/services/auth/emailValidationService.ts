import type { UserEmailToken } from "@instamint/shared-types"

import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"
import type { Services } from "@/types"

const emailValidationService: Services<UserEmailToken> =
  ({ api }) =>
  async (data) => {
    try {
      const body = {
        validation: data.validation,
      }

      const { data: responseData } = await api.put(
        routes.auth.emailValidation,
        body
      )

      return [null, responseData]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default emailValidationService
