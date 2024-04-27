import type { TwoFactorGenerateResult } from "@instamint/shared-types"

import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"
import type { Services } from "@/types"

const twoFactorCodeGenerationService: Services<null, TwoFactorGenerateResult> =
  ({ api }) =>
  async () => {
    const config = {
      withCredentials: true,
    }

    try {
      const { data: responseData } = await api.get<TwoFactorGenerateResult>(
        routes.api.users.twoFactorAuth.generate,
        config
      )

      return [null, responseData]
    } catch (error) {
      return [handleApiErrors(error)]
    }
  }

export default twoFactorCodeGenerationService
