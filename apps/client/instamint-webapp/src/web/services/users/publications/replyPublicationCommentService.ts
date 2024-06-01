import type { ReplyComment, ReplyCommentParam } from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const replyPublicationCommentService: Services<
  ReplyCommentParam & ReplyComment,
  null
> =
  ({ api }) =>
  async (data) => {
    try {
      const { publicationId, commentId, content } = data

      const body = {
        content,
      }

      const config = {
        withCredentials: true,
      }

      const param = {
        publicationId,
        commentId,
      }

      const { data: responseData } = await api.post(
        routes.api.users.publications.replyComment(param),
        body,
        config
      )

      return [null, responseData]
    } catch (error) {
      return [handleApiErrors(error)]
    }
  }

export default replyPublicationCommentService
