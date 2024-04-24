import type { UserInfosSchema } from "@instamint/shared-types"

import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"
import type { Services } from "@/types"

const updateUserInfoService: Services<UserInfosSchema> =
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
