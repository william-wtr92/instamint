import { zValidator } from "@hono/zod-validator"
import { SC, type ApiRoutes } from "@instamint/server-types"
import {
  getPublicationParamSchema,
  getPublicationsParamSchema,
  getPublicationsSchema,
  type GetPublicationParam,
  type GetPublicationsParam,
} from "@instamint/shared-types"
import { type Context, Hono } from "hono"

import PublicationsModel from "@/db/models/PublicationsModel"
import UserModel from "@/db/models/UserModel"
import {
  authMessages,
  contextsKeys,
  globalsMessages,
  usersMessages,
} from "@/def"
import { auth } from "@/middlewares/auth"
import { handleError } from "@/middlewares/handleError"
import { throwInternalError } from "@/utils/errors/throwInternalError"

const preparePublicationsRoutes: ApiRoutes = ({ app, db, redis }) => {
  const publications = new Hono()

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

  publications.get(
    "/publications/:username",
    auth,
    zValidator("param", getPublicationsParamSchema),
    zValidator("query", getPublicationsSchema),
    async (c: Context) => {
      const contextUser: UserModel = c.get(contextsKeys.user)
      const { username } = c.req.param() as GetPublicationsParam
      const { limit: limitString, offset: offsetString } = c.req.query()
      const limit = parseInt(limitString, 10)
      const offset = parseInt(offsetString, 10)

      if (!contextUser) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const searchedUser = await UserModel.query().findOne({ username })

      if (!searchedUser) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const query = PublicationsModel.query()
      query.where({ userId: searchedUser.id })
      query.orderBy("createdAt", "desc")

      const publications = await query
        .modify("paginate", limit, offset)
        .withGraphFetched("likes")
        .withGraphFetched("comments")

      const finalPublications = publications.reduce(
        (acc: PublicationsModel[], publication: PublicationsModel) => {
          const isLiked = publication.likes.some(
            (like) => like.id === contextUser.id
          )

          publication.isLiked = isLiked

          acc.push(publication)

          return acc
        },
        []
      )

      const totalResults = await query.resultSize()
      const totalPages = Math.ceil(totalResults / limit)
      const pagination = {
        limit,
        offset,
        totalResults,
        totalPages,
      }

      return c.json(
        {
          result: {
            publications: finalPublications,
            pagination,
          },
        },
        SC.success.OK
      )
    }
  )

  publications.get(
    "/publication/:publicationId",
    auth,
    zValidator("param", getPublicationParamSchema),
    async (c: Context) => {
      const contextUser: UserModel = c.get(contextsKeys.user)
      const { publicationId } = c.req.param() as GetPublicationParam

      if (!contextUser) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const publication = await PublicationsModel.query()
        .findOne("id", publicationId)
        .withGraphFetched("likes")
        .withGraphFetched("comments")

      if (!publication) {
        return c.json(usersMessages.publicationNotFound, SC.errors.NOT_FOUND)
      }

      const isLiked = publication.likes.some(
        (like) => like.id === contextUser.id
      )

      publication.isLiked = isLiked

      return c.json(
        {
          result: publication,
        },
        SC.success.OK
      )
    }
  )

  publications.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/users", publications)
}

export default preparePublicationsRoutes
