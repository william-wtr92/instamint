import type { PublicationsLikes } from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const likePublicationService: Services<PublicationsLikes, null> =
  ({ api }) =>
  async (data) => {
    try {
      const { publicationId } = data

      const config = {
        withCredentials: true,
      }

      const { data: responseData } = await api.post(
        routes.api.users.publications.like(publicationId),
        null,
        config
      )

      return [null, responseData]
    } catch (error) {
      return [handleApiErrors(error)]
    }
  }

export default likePublicationService
