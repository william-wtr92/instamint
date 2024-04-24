import type { SignUp } from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const signUpService: Services<SignUp> =
  ({ api }) =>
  async (data) => {
    try {
      const body = {
        username: data.username,
        email: data.email,
        password: data.password,
        gdprValidation: data.gdprValidation,
      }

      const { data: responseData } = await api.post(
        routes.api.auth.signUp,
        body
      )

      return [null, responseData]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default signUpService
