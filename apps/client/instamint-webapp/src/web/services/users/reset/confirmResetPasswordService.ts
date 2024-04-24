import type { ConfirmResetPassword } from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const confirmResetPasswordService: Services<ConfirmResetPassword> =
  ({ api }) =>
  async (data) => {
    try {
      const body = {
        password: data.password,
        confirmPassword: data.confirmPassword,
        validation: data.validation,
      }

      const { data: responseData } = await api.put(
        routes.api.users.confirmResetPassword,
        body
      )

      return [null, responseData]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default confirmResetPasswordService
