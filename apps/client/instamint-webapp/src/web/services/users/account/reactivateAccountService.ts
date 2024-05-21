import type { ReactivateAccount } from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const reactivateAccountService: Services<ReactivateAccount, null> =
  ({ api }) =>
  async (data) => {
    try {
      const body = {
        email: data.email,
        password: data.password,
        validation: data.validation,
      }

      const { data: responseData } = await api.put(
        routes.api.users.reactivateAccount,
        body
      )

      return [null, responseData]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default reactivateAccountService
