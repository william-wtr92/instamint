import { zValidator } from "@hono/zod-validator"
import { SC, type ApiRoutes } from "@instamint/server-types"
import { searchSchema, type Search } from "@instamint/shared-types"
import { type Context, Hono } from "hono"

import UserModel from "@/db/models/UserModel"
import { globalsMessages } from "@/def"
import { auth } from "@/middlewares/auth"
import { handleError } from "@/middlewares/handleError"
import { sanitizeUsers } from "@/utils/dto/sanitizeUsers"
import { throwInternalError } from "@/utils/errors/throwInternalError"

const prepareSearchRoutes: ApiRoutes = ({ app, db, redis }) => {
  const search = new Hono()

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

  search.get(
    "/",
    auth,
    zValidator("query", searchSchema),
    async (c: Context): Promise<Response> => {
      const { query, limit, offset } = (await c.req.query()) as Search

      const users = await UserModel.query()
        .where("username", "like", `%${query}%`)
        .limit(parseInt(limit))
        .offset(parseInt(offset))

      const countResult = await UserModel.query()
        .where("username", "like", `%${query}%`)
        .count()
        .first()

      const pagination = {
        limit: parseInt(limit),
        page: parseInt(offset),
        totalUsers: parseInt(countResult?.count!),
        totalPages: Math.ceil(parseInt(countResult?.count!) / parseInt(limit)),
      }

      return c.json(
        {
          result: {
            users: sanitizeUsers(users, ["id"]),
            pagination,
          },
        },
        SC.success.OK
      )
    }
  )

  search.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/search", search)
}

export default prepareSearchRoutes
