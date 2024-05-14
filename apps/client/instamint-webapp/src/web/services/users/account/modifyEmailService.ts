import type { ModifyEmail } from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const modifyEmailService: Services<ModifyEmail> =
  ({ api }) =>
  async (data) => {
    try {
      const body = {
        email: data.email,
        password: data.password,
        newEmail: data.newEmail,
      }

      const config = {
        withCredentials: true,
      }

      const { data: responseData } = await api.put(
        routes.api.users.modifyEmail,
        body,
        config
      )

      return [null, responseData]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default modifyEmailService
