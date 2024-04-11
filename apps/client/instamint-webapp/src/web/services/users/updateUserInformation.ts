import type { UsernameEmailSettingsSchema } from "@instamint/shared-types"

import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"
import type { Services } from "@/types"

const updateUserInformationService: Services<UsernameEmailSettingsSchema> =
  ({ api }) =>
  async (data) => {
    try {
      const body = {
        id: data.id,
        username: data.username,
        email: data.email,
      }

      const { data: responseData } = await api.put(
        routes.users.updateFieldsAccount(data.id),
        body
      )

      return [null, responseData]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default updateUserInformationService
