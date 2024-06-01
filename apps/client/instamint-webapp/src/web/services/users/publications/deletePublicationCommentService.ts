import type { DeleteCommentParam } from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const deletePublicationCommentService: Services<DeleteCommentParam, null> =
  ({ api }) =>
  async (data) => {
    try {
      const { commentId, publicationId } = data

      const config = {
        withCredentials: true,
      }

      const param = {
        publicationId,
        commentId,
      }

      const { data: responseData } = await api.delete(
        routes.api.users.publications.deleteComment(param),
        config
      )

      return [null, responseData]
    } catch (error) {
      return [handleApiErrors(error)]
    }
  }

export default deletePublicationCommentService
