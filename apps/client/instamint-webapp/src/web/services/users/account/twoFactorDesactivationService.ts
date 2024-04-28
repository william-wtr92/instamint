import { type Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

export const twoFactorDesactivationService: Services<string, null> =
  ({ api }) =>
  async (data) => {
    const body = {
      code: data,
    }

    const config = {
      withCredentials: true,
    }

    try {
      await api.post(routes.api.users.twoFactorAuth.desactivate, body, config)

      return [null, null]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }
