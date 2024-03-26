import { SignUp } from "@instamint/shared-types"

import { routes } from "@/web/routes"
import { handleError } from "@/web/utils/handleError"
import { Services } from "@/types"

const signupService: Services<SignUp> =
  ({ api }) =>
  async (data) => {
    try {
      const { data: responseData } = await api.post(routes.users.signup, {
        username: data.username,
        email: data.email,
        password: data.password,
        rgpdValidation: data.rgpdValidation,
      })

      return [null, responseData]
    } catch (err) {
      return [handleError(err)]
    }
  }

export default signupService
