import { type Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const twoFactorDeactivationService: Services<string, null> =
  ({ api }) =>
  async (data) => {
    const body = {
      code: data,
    }

    const config = {
      withCredentials: true,
    }

    try {
      const { data: responseData } = await api.put(
        routes.api.users.twoFactorAuth.deactivate,
        body,
        config
      )

      return [null, responseData]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default twoFactorDeactivationService
