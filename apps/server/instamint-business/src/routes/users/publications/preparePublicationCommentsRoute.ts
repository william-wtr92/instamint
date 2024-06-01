import { zValidator } from "@hono/zod-validator"
import { SC, type ApiRoutes } from "@instamint/server-types"
import {
  addCommentParamSchema,
  addCommentSchema,
  deleteCommentParamSchema,
  replyCommentParamSchema,
  replyCommentSchema,
  type ReplyCommentParam,
  type DeleteCommentParam,
  type AddCommentParam,
} from "@instamint/shared-types"
import { type Context, Hono } from "hono"

import CommentsModel from "@/db/models/CommentsModel"
import PublicationsCommentsRelationModel from "@/db/models/PublicationsCommentsRelationModel"
import PublicationsModel from "@/db/models/PublicationsModel"
import type UserModel from "@/db/models/UserModel"
import {
  authMessages,
  contextsKeys,
  globalsMessages,
  usersMessages,
} from "@/def"
import { auth } from "@/middlewares/auth"
import { handleError } from "@/middlewares/handleError"
import { throwInternalError } from "@/utils/errors/throwInternalError"

const preparePublicationsCommentsRoutes: ApiRoutes = ({ app, db, redis }) => {
  const publicationsComments = new Hono()

  if (!db) {
    throw throwInternalError(
      globalsMessages.databaseNotAvailable,
      SC.serverErrors.INTERNAL_SERVER_ERROR
    )
  }

  if (!redis) {
    throw throwInternalError(
      globalsMessages.redisNotAvailable,
      SC.serverErrors.INTERNAL_SERVER_ERROR
    )
  }

  publicationsComments.post(
    "/publications/:publicationId/comment",
    auth,
    zValidator("param", addCommentParamSchema),
    zValidator("json", addCommentSchema),
    async (c: Context) => {
      const contextUser: UserModel = c.get(contextsKeys.user)
      const { publicationId } = c.req.param() as AddCommentParam
      const { content } = await c.req.json()

      if (!contextUser) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      if (!content) {
        return c.json(
          usersMessages.commentContentRequired,
          SC.errors.BAD_REQUEST
        )
      }

      const publication =
        await PublicationsModel.query().findById(publicationId)

      if (!publication) {
        return c.json(usersMessages.publicationNotFound, SC.errors.NOT_FOUND)
      }

      const comment = await CommentsModel.query()
        .insert({
          userId: contextUser.id,
          content,
        })
        .returning("*")

      await PublicationsCommentsRelationModel.query().insert({
        userId: contextUser.id,
        publicationId: publication.id,
        commentId: comment.id,
      })

      return c.json(usersMessages.commentsSuccessfullyAdded, SC.success.OK)
    }
  )

  publicationsComments.delete(
    "/publications/:publicationId/comment/:commentId",
    auth,
    zValidator("param", deleteCommentParamSchema),
    async (c: Context) => {
      const contextUser: UserModel = c.get(contextsKeys.user)
      const { publicationId, commentId } = c.req.param() as DeleteCommentParam

      if (!contextUser) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const publication =
        await PublicationsModel.query().findById(publicationId)

      if (!publication) {
        return c.json(usersMessages.publicationNotFound, SC.errors.NOT_FOUND)
      }

      const comment = await CommentsModel.query().findById(commentId)

      if (!comment) {
        return c.json(usersMessages.commentNotFound, SC.errors.NOT_FOUND)
      }

      const isUserAuthorizedToDeleteComment = () => {
        return (
          contextUser.id === comment.userId ||
          contextUser.id === publication.userId
        )
      }

      // If not your comment, you're unauthorized to delete it
      if (!isUserAuthorizedToDeleteComment) {
        return c.json(
          usersMessages.notAuthorizedToDeleteComment,
          SC.errors.UNAUTHORIZED
        )
      }

      /* If it has a parentId, then it's a reply to a comment -> we're deleting a reply */
      if (comment.parentId !== null) {
        await PublicationsCommentsRelationModel.query().delete().where({
          commentId,
        })

        await CommentsModel.query().deleteById(commentId)

        return c.json(usersMessages.commentSuccessfullyDeleted, SC.success.OK)
      }

      const commentRepliesIds = await CommentsModel.query()
        .select("id")
        .where("parentId", commentId)

      await Promise.all(
        commentRepliesIds.map(async (reply: CommentsModel) => {
          await PublicationsCommentsRelationModel.query().delete().where({
            commentId: reply.id,
          })

          await CommentsModel.query().deleteById(reply.id)
        })
      )

      await PublicationsCommentsRelationModel.query().delete().where({
        commentId,
      })

      await CommentsModel.query().deleteById(commentId)

      return c.json(usersMessages.commentSuccessfullyDeleted, SC.success.OK)
    }
  )

  publicationsComments.post(
    "/publications/:publicationId/comment/:commentId",
    auth,
    zValidator("param", replyCommentParamSchema),
    zValidator("json", replyCommentSchema),
    async (c: Context) => {
      const contextUser: UserModel = c.get(contextsKeys.user)
      const { publicationId, commentId } = c.req.param() as ReplyCommentParam
      const { content } = await c.req.json()

      if (!contextUser) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      if (!content) {
        return c.json(
          usersMessages.commentContentRequired,
          SC.errors.BAD_REQUEST
        )
      }

      const publication =
        await PublicationsModel.query().findById(publicationId)

      if (!publication) {
        return c.json(usersMessages.publicationNotFound, SC.errors.NOT_FOUND)
      }

      const comment = await CommentsModel.query().findById(commentId)

      if (!comment) {
        return c.json(usersMessages.commentNotFound, SC.errors.NOT_FOUND)
      }

      const replyComment = await CommentsModel.query()
        .insert({
          userId: contextUser.id,
          content,
          parentId: parseInt(commentId),
        })
        .returning("*")

      await PublicationsCommentsRelationModel.query().insert({
        userId: contextUser.id,
        publicationId: publication.id,
        commentId: replyComment.id,
      })

      return c.json(usersMessages.commentsSuccessfullyAdded, SC.success.OK)
    }
  )

  publicationsComments.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/users", publicationsComments)
}

export default preparePublicationsCommentsRoutes
