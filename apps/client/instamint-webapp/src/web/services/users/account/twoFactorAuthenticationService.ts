import type { TwoFactorAuthenticate } from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const twoFactorAuthenticationService: Services<TwoFactorAuthenticate, null> =
  ({ api }) =>
  async (data) => {
    const body = {
      password: data.password,
    }

    const config = {
      withCredentials: true,
    }

    try {
      const { data: responseData } = await api.post(
        routes.api.users.twoFactorAuth.authenticate,
        body,
        config
      )

      return [null, responseData]
    } catch (error) {
      return [handleApiErrors(error)]
    }
  }

export default twoFactorAuthenticationService
