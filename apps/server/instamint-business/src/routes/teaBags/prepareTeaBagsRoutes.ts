import { zValidator } from "@hono/zod-validator"
import { SC, type ApiRoutes } from "@instamint/server-types"
import { type GetTeaBags, getTeaBagsSchema } from "@instamint/shared-types"
import { type Context, Hono } from "hono"

import TeaBagsModel from "@/db/models/TeaBagsModel"
import { globalsMessages } from "@/def"
import { auth } from "@/middlewares/auth"
import { handleError } from "@/middlewares/handleError"
import { throwInternalError } from "@/utils/errors/throwInternalError"

const prepareTeabagsRoutes: ApiRoutes = ({ app, db, redis }) => {
  const teabags = new Hono()

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

  teabags.get(
    "/",
    auth,
    zValidator("query", getTeaBagsSchema),
    async (c: Context): Promise<Response> => {
      const { limit, offset } = (await c.req.query()) as GetTeaBags

      const teabags = await TeaBagsModel.query()
        .limit(parseInt(limit))
        .offset(parseInt(offset))

      return c.json(
        {
          result: {
            teabags,
          },
        },
        SC.success.OK
      )
    }
  )

  teabags.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/teabags", teabags)
}

export default prepareTeabagsRoutes
