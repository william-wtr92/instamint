import type { Profile } from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const followService: Services<Profile, null> =
  ({ api }) =>
  async (data) => {
    try {
      const config = {
        withCredentials: true,
      }

      const { data: responseData } = await api.post(
        routes.api.users.profile.follow({ username: data.username }),
        null,
        config
      )

      return [null, responseData]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default followService