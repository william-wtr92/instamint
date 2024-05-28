import { zValidator } from "@hono/zod-validator"
import { SC, type ApiRoutes } from "@instamint/server-types"
import { getPublicationsSchema } from "@instamint/shared-types"
import { type Context, Hono } from "hono"

import PublicationsModel from "@/db/models/PublicationsModel"
import type UserModel from "@/db/models/UserModel"
import { authMessages, contextsKeys, globalsMessages } from "@/def"
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
    "/publications",
    auth,
    zValidator("query", getPublicationsSchema),
    async (c: Context) => {
      const contextUser: UserModel = c.get(contextsKeys.user)
      const { limit: limitString, offset: offsetString } = c.req.query()
      const limit = parseInt(limitString, 10)
      const offset = parseInt(offsetString, 10)

      if (!contextUser) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const query = PublicationsModel.query()
      query.where({ userId: contextUser.id })
      query.orderBy("createdAt", "desc")

      // const [{ count }]: PublicationsModel[] = await query
      //   .clone()
      //   .clearOrder()
      //   .count("id")

      // const totalPages = Math.ceil(parseInt(count) / limit)

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

      return c.json(
        {
          result: {
            publications: finalPublications,
          },
        },
        SC.success.OK
      )
    }
  )

  publications.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/users", publications)
}

export default preparePublicationsRoutes
