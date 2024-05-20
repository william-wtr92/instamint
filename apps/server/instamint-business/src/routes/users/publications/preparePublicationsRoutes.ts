import { zValidator } from "@hono/zod-validator"
import { SC, type ApiRoutes } from "@instamint/server-types"
import { getPublicationSchema } from "@instamint/shared-types"
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
    zValidator("query", getPublicationSchema),
    async (c: Context) => {
      const contextUser: UserModel = c.get(contextsKeys.user)
      const { limit, offset } = await c.req.query()

      if (!contextUser) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const totalPublications = await PublicationsModel.query()
        .where({ userId: contextUser.id })
        .count()

      const totalCount = parseInt(totalPublications[0].count, 10)

      const newOffset = Math.max(
        totalCount - parseInt(offset, 10) - parseInt(limit, 10),
        0
      )

      const publications = await PublicationsModel.query()
        .where({ userId: contextUser.id })
        .orderBy("createdAt", "asc")
        .limit(parseInt(limit))
        .offset(Math.max(0, newOffset))

      return c.json(
        {
          result: {
            publications: publications,
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
