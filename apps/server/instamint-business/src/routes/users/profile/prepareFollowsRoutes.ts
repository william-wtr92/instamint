import { zValidator } from "@hono/zod-validator"
import { type ApiRoutes, SC } from "@instamint/server-types"
import {
  profileSchema,
  type Profile,
  followPendingSchema,
  type FollowPending,
  type FollowersStatus,
} from "@instamint/shared-types"
import { Hono, type Context } from "hono"

import FollowersModel from "@/db/models/FollowersModel"
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

const prepareFollowsRoutes: ApiRoutes = ({ app, db, redis }) => {
  const follows = new Hono()

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

  follows.post(
    "/:username/follow",
    auth,
    zValidator("param", profileSchema),
    async (c: Context): Promise<Response> => {
      const contextUser: UserModel = c.get(contextsKeys.user)
      const { username } = c.req.param() as Profile

      const user = await UserModel.query().findOne({ email: contextUser.email })

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const targetUser = await UserModel.query().findOne({ username })

      if (!targetUser) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      if (targetUser?.id === user.id) {
        return c.json(usersMessages.cannotFollowYourself, SC.errors.BAD_REQUEST)
      }

      const isFollowing = await FollowersModel.query().findOne({
        followerId: user.id,
        followedId: targetUser.id,
      })

      if (isFollowing) {
        return c.json(usersMessages.alreadyFollowing, SC.success.OK)
      }

      await FollowersModel.query().insert({
        status: targetUser.private ? "pending" : "accepted",
        followerId: user.id,
        followedId: targetUser.id,
      })

      return c.json(
        { message: usersMessages.followedSuccessfully.message },
        SC.success.OK
      )
    }
  )

  follows.get(
    "/follow/requests",
    auth,
    async (c: Context): Promise<Response> => {
      const contextUser: UserModel = c.get(contextsKeys.user)
      const user = await UserModel.query().findOne({ email: contextUser.email })

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const allRequests = await FollowersModel.query()
        .where({
          followedId: user.id,
          status: "pending",
        })
        .withGraphFetched("followerData(selectFollowerData)")

      return c.json({ result: allRequests }, SC.success.OK)
    }
  )

  follows.put(
    "/follow/request",
    auth,
    zValidator("json", followPendingSchema),
    async (c: Context): Promise<Response> => {
      const requestBody = await c.req.json()
      const { username, accepted }: FollowPending = requestBody

      const contextUser: UserModel = c.get(contextsKeys.user)
      const user = await UserModel.query().findOne({
        email: contextUser.email,
      })

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const targetUser = await UserModel.query().findOne({ username })

      if (!targetUser) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const followRequest = await FollowersModel.query().findOne({
        followerId: targetUser.id,
        followedId: user.id,
        status: "pending",
      })

      if (!followRequest) {
        return c.json(usersMessages.followRequestNotFound, SC.errors.NOT_FOUND)
      }

      const finalStatus: FollowersStatus = accepted ? "accepted" : "rejected"

      await FollowersModel.transaction(async (trx) => {
        if (accepted) {
          await FollowersModel.query(trx).patchAndFetchById(followRequest.id, {
            status: finalStatus,
          })
        } else {
          await FollowersModel.query(trx).deleteById(followRequest.id)
        }
      })

      return c.json(
        { message: usersMessages.followRequestResult(finalStatus).message },
        SC.success.OK
      )
    }
  )

  follows.delete(
    "/:username/follow/request",
    auth,
    zValidator("param", profileSchema),
    async (c: Context): Promise<Response> => {
      const { username } = c.req.param() as Profile

      const contextUser: UserModel = c.get(contextsKeys.user)
      const user = await UserModel.query().findOne({ email: contextUser.email })

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const targetUser = await UserModel.query().findOne({ username })

      if (!targetUser) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const followRequest = await FollowersModel.query().findOne({
        followerId: user.id,
        followedId: targetUser.id,
        status: "pending",
      })

      if (!followRequest) {
        return c.json(usersMessages.followRequestNotFound, SC.errors.NOT_FOUND)
      }

      await FollowersModel.query().deleteById(followRequest.id)

      return c.json(
        { message: usersMessages.followRequestDeleted.message },
        SC.success.OK
      )
    }
  )

  follows.put(
    "/:username/unfollow",
    auth,
    zValidator("param", profileSchema),
    async (c: Context): Promise<Response> => {
      const contextUser: UserModel = c.get(contextsKeys.user)
      const { username } = c.req.param() as Profile

      const user = await UserModel.query().findOne({ email: contextUser.email })

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const targetUser = await UserModel.query().findOne({ username })

      if (!targetUser) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const isFollowing = await FollowersModel.query().findOne({
        followerId: user.id,
        followedId: targetUser.id,
        status: "accepted",
      })

      if (!isFollowing) {
        return c.json(usersMessages.followRequestNotFound, SC.errors.NOT_FOUND)
      }

      await FollowersModel.query().deleteById(isFollowing.id)

      return c.json(
        { message: usersMessages.unfollowedSuccessfully.message },
        SC.success.OK
      )
    }
  )

  app.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/profile", follows)
}

export default prepareFollowsRoutes
