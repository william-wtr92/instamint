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

      const queryContainsAtSymbol = query.includes("@")
      const querySearch = UserModel.query().where((builder) => {
        builder.where("username", "like", `%${query}%`).orWhere((qb) => {
          if (queryContainsAtSymbol) {
            qb.where("searchByEmail", true).andWhere(
              "email",
              "like",
              `%${query}%`
            )
          }
        })
      })

      const users = await querySearch
        .limit(parseInt(limit))
        .offset(parseInt(offset))

      const countResult = await querySearch.count().first()

      const totalResults = parseInt(countResult?.count!)
      const totalPages = Math.ceil(totalResults / parseInt(limit))

      const pagination = {
        limit: parseInt(limit),
        page: parseInt(offset),
        totalResults,
        totalPages,
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
