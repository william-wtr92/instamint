import { type Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"
import { type TwoFactorSignInWithBackupCode } from "@instamint/shared-types"

const signIn2faBackupCodeService: Services<
  TwoFactorSignInWithBackupCode,
  null
> =
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
        routes.api.auth.signIn2faBackupCode,
        body,
        config
      )

      return [null, responseData]
    } catch (error) {
      return [handleApiErrors(error)]
    }
  }

export default signIn2faBackupCodeService
