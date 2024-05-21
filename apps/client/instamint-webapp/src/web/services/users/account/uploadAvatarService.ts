import type { UserAvatar } from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const uploadAvatarService: Services<UserAvatar, null> =
  ({ api }) =>
  async (data) => {
    try {
      const formData = new FormData()

      if (data?.avatar) {
        formData.append("image", data.avatar, data.avatar.name)
      }

      const config = {
        withCredentials: true,
      }

      const { data: responseData } = await api.post(
        routes.api.users.uploadAvatar,
        formData,
        config
      )

      return [null, responseData]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default uploadAvatarService
