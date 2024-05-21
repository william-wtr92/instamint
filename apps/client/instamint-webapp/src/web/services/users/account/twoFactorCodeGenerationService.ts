import type {
  TwoFactorGenerateResult,
  TwoFactorGenerateResponse,
} from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const twoFactorCodeGenerationService: Services<null, TwoFactorGenerateResult> =
  ({ api }) =>
  async () => {
    const config = {
      withCredentials: true,
    }

    try {
      const {
        data: { result },
      } = await api.get<TwoFactorGenerateResponse>(
        routes.api.users.twoFactorAuth.generate,
        config
      )

      return [null, result]
    } catch (error) {
      return [handleApiErrors(error)]
    }
  }

export default twoFactorCodeGenerationService
