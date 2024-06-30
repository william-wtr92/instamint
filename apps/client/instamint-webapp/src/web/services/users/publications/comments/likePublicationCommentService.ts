import type { ReplyCommentParam } from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const likePublicationCommentService: Services<ReplyCommentParam, null> =
  ({ api }) =>
  async (data) => {
    try {
      const { publicationId, commentId } = data

      const config = {
        withCredentials: true,
      }

      const param = {
        publicationId,
        commentId,
      }

      const { data: responseData } = await api.post(
        routes.api.users.publications.likeComment(param),
        null,
        config
      )

      return [null, responseData]
    } catch (error) {
      return [handleApiErrors(error)]
    }
  }

export default likePublicationCommentService
