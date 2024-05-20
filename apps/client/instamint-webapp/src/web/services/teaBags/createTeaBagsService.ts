import type { CreateTeaBags } from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const createTeaBagsService: Services<CreateTeaBags, null> =
  ({ api }) =>
  async (data) => {
    try {
      const body = {
        name: data.name,
        bio: data.bio,
        link: data.link,
      }

      const config = {
        withCredentials: true,
      }

      const { data: responseData } = await api.post(
        routes.api.teaBags.createTeaBags,
        body,
        config
      )

      return [null, responseData]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default createTeaBagsService
