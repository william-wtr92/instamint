import type { AddComment, AddCommentParam } from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const addPublicationCommentService: Services<
  AddComment & AddCommentParam,
  null
> =
  ({ api }) =>
  async (data) => {
    try {
      const { publicationId, userId, content } = data

      const body = {
        userId,
        content,
      }

      const config = {
        withCredentials: true,
      }

      const { data: responseData } = await api.post(
        routes.api.users.publications.comment(publicationId),
        body,
        config
      )

      return [null, responseData]
    } catch (error) {
      return [handleApiErrors(error)]
    }
  }

export default addPublicationCommentService
