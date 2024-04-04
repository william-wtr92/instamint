import { type Context, Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import sgMail from "@sendgrid/mail"
import { type ApiRoutes, SC } from "@instamint/server-types"
import {
  type DeleteAccount,
  deleteAccountSchema,
  type ReactivateAccount,
  reactivateAccountSchema,
} from "@instamint/shared-types"

import { createErrorResponse } from "@/utils/errors/createErrorResponse"
import {
  authMessages,
  contextsKeys,
  cookiesKeys,
  globalsMessages,
  redisKeys,
  usersMessages,
} from "@/def"
import { handleError } from "@/middlewares/handleError"
import UserModel from "@/db/models/UserModel"
import { auth } from "@/middlewares/auth"
import { deleteAccountJob } from "@/middlewares/jobs/deleteAccountJob"
import {
  now,
  nowDate,
  oneMonth,
  oneMonthTTL,
  sixMonthsDate,
} from "@/utils/helpers/times"
import { mailBuilder } from "@/utils/helpers/mailBuilder"
import appConfig from "@/db/config/config"
import { decodeJwt } from "@/utils/helpers/jwtActions"
import { jwtTokenErrors } from "@/utils/errors/jwtTokenErrors"
import { delCookie } from "@/utils/helpers/cookiesActions"

const prepareDeleteAccountRoutes: ApiRoutes = ({ app, db, redis }) => {
  const deleteAccount = new Hono()

  if (!db) {
    throw createErrorResponse(
      globalsMessages.databaseNotAvailable,
      SC.serverErrors.INTERNAL_SERVER_ERROR
    )
  }

  if (!redis) {
    throw createErrorResponse(
      globalsMessages.redisNotAvailable,
      SC.serverErrors.INTERNAL_SERVER_ERROR
    )
  }

  deleteAccount.put(
    "/delete-account",
    auth,
    zValidator("json", deleteAccountSchema),
    async (c: Context): Promise<Response> => {
      const contextUser: UserModel = c.get(contextsKeys.user)

      const user = await UserModel.query().findOne({ email: contextUser.email })

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      if (!user.active) {
        return c.json(
          usersMessages.accountAlreadyDeactivated,
          SC.errors.BAD_REQUEST
        )
      }

      const requestBody = await c.req.json()
      const { password }: DeleteAccount = requestBody
      const validity = await user?.checkPassword(password)

      if (!validity) {
        return c.json(authMessages.invalidPassword, SC.errors.BAD_REQUEST)
      }

      await db("users").where({ email: user.email }).update({
        active: false,
        deactivationDate: nowDate,
        deletionDate: sixMonthsDate,
      })

      const deleteAccountMail = await mailBuilder(
        {
          username: user.username,
          email: user.email,
        },
        appConfig.sendgrid.templates.reactivateAccount,
        oneMonth,
        true
      )

      await sgMail.send(deleteAccountMail)

      const reactivateAccountKey = redisKeys.users.reactivateAccount(user.email)
      const sessionKey = redisKeys.auth.authSession(user.email)

      await redis
        .multi()
        .set(reactivateAccountKey, now, "EX", oneMonthTTL)
        .del(sessionKey)
        .exec()

      await delCookie(c, cookiesKeys.auth.session)

      return c.json(
        { message: usersMessages.deletedAccount.message },
        SC.success.OK
      )
    }
  )

  deleteAccount.post(
    "/delete-account/job",
    deleteAccountJob,
    async (c: Context): Promise<Response> => {
      const deleteAccountKey = c.get(contextsKeys.cron.deleteAccount)

      const users = await UserModel.query().where({
        active: false,
      })

      if (users.length) {
        users.map(async (user) => {
          if (user.deletionDate && nowDate > user.deletionDate) {
            await db("users").where({ email: user.email }).delete()

            const confirmDeleteAccountMail = await mailBuilder(
              {
                username: user.username,
                email: user.email,
              },
              appConfig.sendgrid.templates.confirmDeleteAccount
            )

            await sgMail.send(confirmDeleteAccountMail)
          }
        })
      }

      await redis.del(deleteAccountKey)

      return c.json(
        { message: usersMessages.deletedAccountJob.message },
        SC.success.OK
      )
    }
  )

  deleteAccount.put(
    "/reactivate-account",
    zValidator("json", reactivateAccountSchema),
    async (c: Context): Promise<Response> => {
      const requestBody = await c.req.json()
      const { email, password, validation }: ReactivateAccount = requestBody

      if (validation == null) {
        return c.json(globalsMessages.tokenNotProvided, SC.errors.BAD_REQUEST)
      }

      const user = await UserModel.query().findOne({ email })

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const validity = await user.checkPassword(password)

      if (!validity) {
        return c.json(authMessages.invalidPassword, SC.errors.BAD_REQUEST)
      }

      if (user.active) {
        return c.json(
          usersMessages.accountAlreadyActivated,
          SC.errors.BAD_REQUEST
        )
      }

      try {
        const decodedToken = await decodeJwt(validation)
        const decodedUserEmail = decodedToken.payload.user.email

        const reactivateAccountKey = redisKeys.users.reactivateAccount(email)
        const reactivateAccount = await redis.get(reactivateAccountKey)

        if (!reactivateAccount) {
          return c.json(
            usersMessages.reactivateAccountDateExpired,
            SC.errors.BAD_REQUEST
          )
        }

        if (email !== decodedUserEmail) {
          return c.json(
            usersMessages.reactivateAccountEmailMismatch,
            SC.errors.BAD_REQUEST
          )
        }

        await db("users").where({ email: user.email }).update({
          active: true,
          deactivationDate: null,
          deletionDate: null,
        })

        const confirmReactivateAccountMail = await mailBuilder(
          {
            username: user.username,
            email: user.email,
          },
          appConfig.sendgrid.templates.confirmReactivateAccount
        )

        await sgMail.send(confirmReactivateAccountMail)

        await redis.del(reactivateAccountKey)

        return c.json(
          {
            message: usersMessages.reactivatedAccount.message,
          },
          SC.success.OK
        )
      } catch (err) {
        throw jwtTokenErrors(err)
      }
    }
  )

  deleteAccount.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/users", deleteAccount)
}

export default prepareDeleteAccountRoutes
