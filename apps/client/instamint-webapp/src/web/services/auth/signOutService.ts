import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"
import type { Services } from "@/types"

const signOutService: Services<null, null> =
  ({ api }) =>
  async () => {
    try {
      const config = {
        withCredentials: true,
      }

      await api.post(routes.api.auth.signOut, null, config)

      return [null, null]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default signOutService
