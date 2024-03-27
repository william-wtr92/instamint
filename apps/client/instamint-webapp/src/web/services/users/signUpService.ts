import type { SignUp } from "@instamint/shared-types"

import { routes } from "@/web/routes"
import { handleError } from "@/web/utils/handleError"
import type { Services } from "@/types"

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

      const { data: responseData } = await api.post(routes.users.signUp, body)

      return [null, responseData]
    } catch (err) {
      return [handleError(err)]
    }
  }

export default signUpService
