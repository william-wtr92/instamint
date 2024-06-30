import { zValidator } from "@hono/zod-validator"
import { type ApiRoutes, SC } from "@instamint/server-types"
import { profileSchema, type Profile } from "@instamint/shared-types"
import { Hono, type Context } from "hono"

import FollowerModel from "@/db/models/FollowerModel"
import UserModel from "@/db/models/UserModel"
import { authMessages, contextsKeys, globalsMessages } from "@/def"
import { auth } from "@/middlewares/auth"
import { handleError } from "@/middlewares/handleError"
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
      const contextUser: UserModel = c.get(contextsKeys.user)
      const { username } = c.req.param() as Profile

      const userAuth = await UserModel.query().findOne({
        email: contextUser.email,
      })

      const userByUsername = await UserModel.query()
        .where({ username })
        .withGraphFetched("publicationData")
        .first()

      const userByLink = await UserModel.query()
        .where({ link: username })
        .withGraphFetched("publicationData")
        .first()

      const targetUser = userByLink ? userByLink : userByUsername

      if (!targetUser || !userAuth) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const countFollower = await FollowerModel.query()
        .where({ followedId: targetUser.id, status: "accepted" })
        .count()
        .first()

      const countFollowed = await FollowerModel.query()
        .where({ followerId: targetUser.id, status: "accepted" })
        .count()
        .first()

      const isFollowing = await FollowerModel.query().findOne({
        followerId: userAuth.id,
        followedId: targetUser.id,
      })

      const requestPending = await FollowerModel.query()
        .findOne({
          followerId: targetUser.id,
          followedId: userAuth.id,
          status: "pending",
        })
        .first()

      return c.json(
        {
          result: sanitizeUser(targetUser, [
            "id",
            "bio",
            "publicationData",
            "avatar",
            "private",
          ]),
          followers: countFollower?.count,
          followed: countFollowed?.count,
          isFollowing: isFollowing?.status,
          requestPending: !!requestPending,
        },
        SC.success.OK
      )
    }
  )

  profile.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/profile", profile)
}

export default prepareProfileRoutes
