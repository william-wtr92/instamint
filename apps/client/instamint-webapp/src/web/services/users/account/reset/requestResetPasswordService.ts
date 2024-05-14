import type { RequestResetPassword } from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const requestResetPasswordService: Services<RequestResetPassword, null> =
  ({ api }) =>
  async (data) => {
    try {
      const body = {
        email: data.email,
      }

      const { data: responseData } = await api.post(
        routes.api.users.requestResetPassword,
        body
      )

      return [null, responseData]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default requestResetPasswordService
