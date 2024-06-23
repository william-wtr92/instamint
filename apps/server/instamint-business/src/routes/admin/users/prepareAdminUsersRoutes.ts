import { zValidator } from "@hono/zod-validator"
import { type ApiRoutes, SC } from "@instamint/server-types"
import {
  type AdminUsersAll,
  adminUsersAllSchema,
} from "@instamint/shared-types"
import { type Context, Hono } from "hono"

import UserModel from "@/db/models/UserModel"
import { adminMessages, globalsMessages } from "@/def"
import { handleError } from "@/middlewares/handleError"
import { sanitizeUsers } from "@/utils/dto/sanitizeUsers"
import { throwInternalError } from "@/utils/errors/throwInternalError"

const prepareAdminUsersRoutes: ApiRoutes = ({ app, db, redis }) => {
  const adminUsers = new Hono()

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

  adminUsers.get(
    "/users",
    zValidator("query", adminUsersAllSchema),
    async (c: Context): Promise<Response> => {
      const { limit, offset, filter } = (await c.req.query()) as AdminUsersAll

      let query = UserModel.query()
        .withGraphFetched("roleData")
        .orderBy("createdAt", "desc")
        .limit(parseInt(limit))
        .offset(parseInt(offset))

      if (filter) {
        query = query.where("email", "like", `%${filter}%`)
      }

      const users = await query

      if (!users) {
        return c.json(adminMessages.noUsersFound, SC.errors.NOT_FOUND)
      }

      let countQuery = UserModel.query().count().first()

      if (filter) {
        countQuery = countQuery.where("email", "like", `%${filter}%`)
      }

      const countUsers = await countQuery.count().first()

      const pagination = {
        limit: parseInt(limit),
        page: parseInt(offset),
        totalResults: parseInt(countUsers?.count!),
        totalPages: Math.ceil(parseInt(countUsers?.count!) / parseInt(limit)),
      }

      return c.json(
        {
          message: adminMessages.usersFoundSuccessfully.message,
          result: {
            users: sanitizeUsers(users, [
              "id",
              "createdAt",
              "active",
              "deletionDate",
            ]),
            pagination,
          },
        },
        SC.success.OK
      )
    }
  )

  adminUsers.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/admin", adminUsers)
}

export default prepareAdminUsersRoutes
