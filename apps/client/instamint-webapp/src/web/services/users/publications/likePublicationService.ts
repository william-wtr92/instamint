import type { PublicationsLikesParam } from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const likePublicationService: Services<PublicationsLikesParam, null> =
  ({ api }) =>
  async (data) => {
    try {
      const { publicationId } = data

      const config = {
        withCredentials: true,
      }

      const param = {
        publicationId,
      }

      const { data: responseData } = await api.post(
        routes.api.users.publications.like(param),
        null,
        config
      )

      return [null, responseData]
    } catch (error) {
      return [handleApiErrors(error)]
    }
  }

export default likePublicationService
