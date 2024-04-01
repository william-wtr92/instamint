import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"
import type { Services } from "@/types"

const signOutService: Services<null> =
  ({ api }) =>
  async () => {
    try {
      const config = {
        withCredentials: true,
      }

      const { data: responseData } = await api.post(
        routes.auth.signOut,
        null,
        config
      )

      return [null, responseData]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default signOutService
