import type { UserInfos } from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const updateUserInfoService: Services<UserInfos> =
  ({ api }) =>
  async (data) => {
    try {
      const body = {
        username: data?.username,
        bio: data?.bio,
        link: data?.link,
        location: data?.location,
      }

      const config = {
        withCredentials: true,
      }

      const { data: responseData } = await api.put(
        routes.api.users.updateUserInfos,
        body,
        config
      )

      return [null, responseData]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default updateUserInfoService
