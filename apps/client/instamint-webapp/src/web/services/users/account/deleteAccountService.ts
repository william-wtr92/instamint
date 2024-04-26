import type { DeleteAccount } from "@instamint/shared-types"

import type { Services } from "@/types"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"
import { routes } from "@/web/routes"

const deleteAccountService: Services<DeleteAccount, null> =
  ({ api }) =>
  async (data) => {
    try {
      const body = {
        password: data.password,
        confirmPassword: data.confirmPassword,
      }

      const config = {
        withCredentials: true,
      }

      const { data: responseData } = await api.put(
        routes.api.users.deleteAccount,
        body,
        config
      )

      return [null, responseData]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default deleteAccountService
