import { type TwoFactorSignIn } from "@instamint/shared-types"

import { type Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const signIn2faService: Services<TwoFactorSignIn, null> =
  ({ api }) =>
  async (data) => {
    const body = {
      ...data,
    }

    const config = {
      withCredentials: true,
    }

    try {
      const { data: responseData } = await api.post(
        routes.api.auth.signIn2fa,
        body,
        config
      )

      return [null, responseData]
    } catch (error) {
      return [handleApiErrors(error)]
    }
  }

export default signIn2faService
