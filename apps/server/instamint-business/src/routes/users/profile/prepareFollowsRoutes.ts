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

import FollowerModel from "@/db/models/FollowerModel"
import NotificationModel from "@/db/models/NotificationModel"
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

      const isFollowing = await FollowerModel.query().findOne({
        followedId: targetUser.id,
        followerId: user.id,
      })

      if (isFollowing) {
        return c.json(usersMessages.alreadyFollowing, SC.success.OK)
      }

      const trx = await db.transaction()

      try {
        await FollowerModel.query(trx).insert({
          status: targetUser.private ? "pending" : "accepted",
          followedId: targetUser.id,
          followerId: user.id,
        })

        await NotificationModel.query(trx).insert({
          type: "follow",
          notifiedUserId: targetUser.id,
          notifierUserId: user.id,
        })

        await trx.commit()
      } catch (e) {
        await trx.rollback()

        return c.json(usersMessages.followFailed, SC.errors.BAD_REQUEST)
      }

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

      const allRequests = await FollowerModel.query()
        .where({
          followedId: user.id,
          status: "pending",
        })
        .withGraphFetched("followerData(selectSanitizedUser)")

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

      const followRequest = await FollowerModel.query().findOne({
        status: "pending",
        followedId: user.id,
        followerId: targetUser.id,
      })

      if (!followRequest) {
        return c.json(usersMessages.followRequestNotFound, SC.errors.NOT_FOUND)
      }

      const finalStatus: FollowersStatus = accepted ? "accepted" : "rejected"

      await FollowerModel.transaction(async (trx) => {
        if (accepted) {
          await FollowerModel.query(trx).patchAndFetchById(followRequest.id, {
            status: finalStatus,
          })
        } else {
          await FollowerModel.query(trx).deleteById(followRequest.id)
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

      const followRequest = await FollowerModel.query().findOne({
        status: "pending",
        followedId: targetUser.id,
        followerId: user.id,
      })

      if (!followRequest) {
        return c.json(usersMessages.followRequestNotFound, SC.errors.NOT_FOUND)
      }

      await FollowerModel.query().deleteById(followRequest.id)

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

      const isFollowing = await FollowerModel.query().findOne({
        status: "accepted",
        followedId: targetUser.id,
        followerId: user.id,
      })

      if (!isFollowing) {
        return c.json(usersMessages.followRequestNotFound, SC.errors.NOT_FOUND)
      }

      await FollowerModel.query().deleteById(isFollowing.id)

      return c.json(
        { message: usersMessages.unfollowedSuccessfully.message },
        SC.success.OK
      )
    }
  )

  follows.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/profile", follows)
}

export default prepareFollowsRoutes
