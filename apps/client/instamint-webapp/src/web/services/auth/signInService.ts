import type { SignIn } from "@instamint/shared-types"

import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"
import type { Services } from "@/types"

const signInService: Services<SignIn> =
  ({ api }) =>
  async (data) => {
    try {
      const body = {
        email: data.email,
        password: data.password,
      }

      const config = {
        withCredentials: true,
      }

      const { data: responseData } = await api.post(
        routes.auth.signIn,
        body,
        config
      )

      return [null, responseData]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default signInService
