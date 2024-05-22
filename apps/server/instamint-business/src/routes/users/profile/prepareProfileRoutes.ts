import { zValidator } from "@hono/zod-validator"
import { type ApiRoutes, SC } from "@instamint/server-types"
import { profileSchema, type Profile } from "@instamint/shared-types"
import { Hono, type Context } from "hono"

import FollowersModel from "@/db/models/FollowersModel"
import UserModel from "@/db/models/UserModel"
import { authMessages, globalsMessages } from "@/def"
import { auth } from "@/middlewares/auth"
import { sanitizeUser } from "@/utils/dto/sanitizeUsers"
import { throwInternalError } from "@/utils/errors/throwInternalError"

const prepareProfileRoutes: ApiRoutes = ({ app, db, redis }) => {
  const profile = new Hono()

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

  profile.get(
    "/:username",
    auth,
    zValidator("param", profileSchema),
    async (c: Context): Promise<Response> => {
      const { username } = c.req.param() as Profile

      const userByUsername = await UserModel.query()
        .where({ username })
        .withGraphFetched("publicationData")
        .first()

      const userByLink = await UserModel.query()
        .where({ link: username })
        .withGraphFetched("publicationData")
        .first()

      const user = userByLink ? userByLink : userByUsername

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const countFollower = await FollowersModel.query()
        .where({ followedId: user.id })
        .count()
        .first()

      const countFollowed = await FollowersModel.query()
        .where({ followerId: user.id })
        .count()
        .first()

      return c.json(
        {
          result: sanitizeUser(user, [
            "bio",
            "id",
            "publicationData",
            "avatar",
          ]),
          followers: countFollower,
          followed: countFollowed,
        },
        SC.success.OK
      )
    }
  )

  app.route("/profile", profile)
}

export default prepareProfileRoutes
