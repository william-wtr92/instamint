import type { FollowPending } from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const followRequestService: Services<FollowPending, null> =
  ({ api }) =>
  async (data) => {
    try {
      const body = {
        username: data.username,
        accepted: data.accepted,
      }

      const config = {
        withCredentials: true,
      }

      const { data: responseData } = await api.put(
        routes.api.users.profile.followRequest,
        body,
        config
      )

      return [null, responseData]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default followRequestService
