import type { UsernameEmailSettingsSchema } from "@instamint/shared-types"

import type { Services } from "@/types"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"
import { routes } from "@/web/routes"

const userGetInformationService: Services<UsernameEmailSettingsSchema> =
  ({ api }) =>
  async (data) => {
    try {
      const { data: responseData } = await api.get(
        routes.users.actionUser(data.id)
      )

      return [null, responseData.user]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default userGetInformationService
