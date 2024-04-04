import { type Context, Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import sgMail from "@sendgrid/mail"
import { type ApiRoutes, SC } from "@instamint/server-types"
import {
  type ConfirmResetPassword,
  confirmResetPasswordSchema,
  type RequestResetPassword,
  requestResetPasswordSchema,
} from "@instamint/shared-types"

import { createErrorResponse } from "@/utils/errors/createErrorResponse"
import {
  authMessages,
  emailsMessages,
  globalsMessages,
  redisKeys,
  sgKeys,
  usersMessages,
} from "@/def"
import { handleError } from "@/middlewares/handleError"
import UserModel from "@/db/models/UserModel"
import { mailBuilder } from "@/utils/helpers/mailBuilder"
import {
  now,
  oneHour,
  oneHourTTL,
  tenMinutesTTL,
  twoDaysTTL,
} from "@/utils/helpers/times"
import { decodeJwt } from "@/utils/helpers/jwtActions"
import { jwtTokenErrors } from "@/utils/errors/jwtTokenErrors"
import { hashPassword } from "@/utils/helpers/hashPassword"

const prepareResetRoutes: ApiRoutes = ({ app, db, redis }) => {
  const reset = new Hono()

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

  reset.post(
    "/reset-password/request",
    zValidator("json", requestResetPasswordSchema),
    async (c: Context): Promise<Response> => {
      const requestBody = await c.req.json()
      const { email }: RequestResetPassword = requestBody

      const resetPasswordKey = redisKeys.users.resetPassword(email)
      const lastResetPasswordRequest = await redis.get(resetPasswordKey)

      if (lastResetPasswordRequest) {
        return c.json(
          emailsMessages.userMustWaitBeforeSendingAnotherMail,
          SC.errors.TOO_MANY_REQUESTS
        )
      }

      const user = await UserModel.query().findOne({ email })

      if (!user || !user.active) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const requestResetPasswordMail = await mailBuilder(
        {
          email: user.email,
        },
        sgKeys.users.resetPassword,
        oneHour,
        true
      )

      const resetPasswordTokenKey = redisKeys.users.resetPasswordToken(
        requestResetPasswordMail.dynamic_template_data.token as string
      )

      await sgMail.send(requestResetPasswordMail)

      await redis
        .multi()
        .set(resetPasswordKey, now, "EX", tenMinutesTTL)
        .set(resetPasswordTokenKey, now, "EX", oneHourTTL)
        .exec()

      return c.json(
        { message: emailsMessages.emailSent.message },
        SC.success.OK
      )
    }
  )

  reset.put(
    "/reset-password/confirm",
    zValidator("json", confirmResetPasswordSchema),
    async (c: Context): Promise<Response> => {
      const requestBody = await c.req.json()
      const { password, confirmPassword, validation }: ConfirmResetPassword =
        requestBody

      if (validation == null) {
        return c.json(globalsMessages.tokenNotProvided, SC.errors.BAD_REQUEST)
      }

      const resetPasswordTokenKey =
        redisKeys.users.resetPasswordToken(validation)
      const resetPasswordToken = await redis.get(resetPasswordTokenKey)

      if (!resetPasswordToken) {
        return c.json(globalsMessages.tokenExpired, SC.errors.BAD_REQUEST)
      }

      if (password !== confirmPassword) {
        return c.json(usersMessages.passwordsMustMatch, SC.errors.BAD_REQUEST)
      }

      try {
        const decodedToken = await decodeJwt(validation)

        const email: string = decodedToken.payload.user.email

        const user = await UserModel.query().findOne({ email })

        if (!user || !user.active) {
          return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
        }

        const checkPastPassword = await user.checkPassword(password)

        if (checkPastPassword) {
          return c.json(
            usersMessages.newPasswordMustBeDifferentFromOldOne,
            SC.errors.BAD_REQUEST
          )
        }

        const lastResetPasswordKey = redisKeys.users.lastResetPassword(email)
        const lastResetPassword = await redis.get(lastResetPasswordKey)

        if (lastResetPassword) {
          return c.json(
            usersMessages.userMustWaitBeforeResettingPassword,
            SC.errors.TOO_MANY_REQUESTS
          )
        }

        const [passwordHash, passwordSalt] = await hashPassword(password)

        await db("users").where({ email }).update({
          passwordHash,
          passwordSalt,
        })

        await redis
          .multi()
          .set(lastResetPasswordKey, now, "EX", twoDaysTTL)
          .del(resetPasswordTokenKey)
          .exec()

        const confirmResetPasswordMail = await mailBuilder(
          {
            username: user.username,
            email: user.email,
          },
          sgKeys.users.confirmResetPassword
        )

        await sgMail.send(confirmResetPasswordMail)

        return c.json(
          { message: usersMessages.passwordUpdated.message },
          SC.success.OK
        )
      } catch (err) {
        throw jwtTokenErrors(err)
      }
    }
  )

  reset.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/users", reset)
}

export default prepareResetRoutes