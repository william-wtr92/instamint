import type { Services } from "@/types"
import type { ActivateTwoFactorAuth } from "@instamint/shared-types"

import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const twoFactorActivationService: Services<ActivateTwoFactorAuth> =
  ({ api }) =>
  async (data) => {
    const body = {
      code: data.code,
    }

    try {
      const { data: responseData } = await api.post(
        routes.api.auth.twoFactorAuth.activate,
        body
      )

      return [null, responseData]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default twoFactorActivationService
