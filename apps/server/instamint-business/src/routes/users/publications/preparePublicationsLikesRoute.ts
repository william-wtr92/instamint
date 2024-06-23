import { zValidator } from "@hono/zod-validator"
import { SC, type ApiRoutes } from "@instamint/server-types"
import {
  publicationsLikesParamSchema,
  type PublicationsLikesParam,
} from "@instamint/shared-types"
import { type Context, Hono } from "hono"

import PublicationsLikesModel from "@/db/models/PublicationsLikesModel"
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

const preparePublicationsLikesRoutes: ApiRoutes = ({ app, db, redis }) => {
  const publicationsLikes = new Hono()

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

  publicationsLikes.post(
    "/publications/:publicationId/like",
    auth,
    zValidator("param", publicationsLikesParamSchema),
    async (c: Context) => {
      const contextUser: UserModel = c.get(contextsKeys.user)
      const { publicationId } = c.req.param() as PublicationsLikesParam

      if (!contextUser) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const publication =
        await PublicationsModel.query().findById(publicationId)

      if (!publication) {
        return c.json(usersMessages.publicationNotFound, SC.errors.NOT_FOUND)
      }

      const publicationLike = await PublicationsLikesModel.query()
        .select("*")
        .where({
          userId: contextUser.id,
          publicationId: parseInt(publicationId),
        })

      const isLiked = publicationLike.length !== 0

      if (isLiked) {
        await PublicationsLikesModel.query()
          .delete()
          .where({
            userId: contextUser.id,
            publicationId: parseInt(publicationId),
          })

        return c.json(
          usersMessages.publicationSuccessfullyDisliked,
          SC.success.OK
        )
      }

      await PublicationsLikesModel.query()
        .insert({
          userId: contextUser.id,
          publicationId: parseInt(publicationId),
        })
        .returning("*")

      return c.json(usersMessages.publicationSuccessfullyLiked, SC.success.OK)
    }
  )

  publicationsLikes.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/users", publicationsLikes)
}

export default preparePublicationsLikesRoutes
