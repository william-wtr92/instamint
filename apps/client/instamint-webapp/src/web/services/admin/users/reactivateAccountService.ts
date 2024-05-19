import type { UserIdAdminAction } from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const reactivateAccountAdminService: Services<UserIdAdminAction> =
  ({ api }) =>
  async (data) => {
    try {
      const id = data.id

      const config = {
        withCredentials: true,
      }

      const { data: responseData } = await api.put(
        routes.api.admin.users.reactivate({ id }),
        null,
        config
      )

      return [null, responseData]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default reactivateAccountAdminService
