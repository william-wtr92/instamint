import type { ConfirmModifyPassword } from "@instamint/shared-types"

import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"
import type { Services } from "@/types"

const modifyPasswordService: Services<ConfirmModifyPassword> =
  ({ api }) =>
  async (data) => {
    try {
      const body = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      }

      const config = {
        withCredentials: true,
      }

      const { data: responseData } = await api.put(
        routes.api.users.modifyPassword,
        body,
        config
      )

      return [null, responseData]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default modifyPasswordService
