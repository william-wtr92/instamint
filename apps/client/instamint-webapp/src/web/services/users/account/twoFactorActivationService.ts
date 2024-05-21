import type {
  ActivateTwoFactorAuthResponse,
  ActivateTwoFactorAuthResult,
} from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const twoFactorActivationService: Services<
  string,
  ActivateTwoFactorAuthResult
> =
  ({ api }) =>
  async (data) => {
    const body = {
      code: data,
    }

    const config = {
      withCredentials: true,
    }

    try {
      const {
        data: { result },
      } = await api.post<ActivateTwoFactorAuthResponse>(
        routes.api.users.twoFactorAuth.activate,
        body,
        config
      )

      return [null, result]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default twoFactorActivationService
