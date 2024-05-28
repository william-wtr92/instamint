import type { Visibility } from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const updateVisibilityAccountService: Services<Visibility, null> =
  ({ api }) =>
  async (data) => {
    try {
      const body = {
        isPrivate: data.isPrivate,
      }

      const config = {
        withCredentials: true,
      }

      const { data: responseData } = await api.put(
        routes.api.users.visibility,
        body,
        config
      )

      return [null, responseData]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default updateVisibilityAccountService
