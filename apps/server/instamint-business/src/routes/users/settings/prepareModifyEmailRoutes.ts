import { zValidator } from "@hono/zod-validator"
import { type ApiRoutes, SC } from "@instamint/server-types"
import { modifyEmailSchema, type ModifyEmail } from "@instamint/shared-types"
import sgMail from "@sendgrid/mail"
import { type Context, Hono } from "hono"

import appConfig from "@/db/config/config"
import UserModel from "@/db/models/UserModel"
import {
  authMessages,
  contextsKeys,
  globalsMessages,
  redisKeys,
  sgKeys,
  usersMessages,
} from "@/def"
import { auth } from "@/middlewares/auth"
import { handleError } from "@/middlewares/handleError"
import { throwInternalError } from "@/utils/errors/throwInternalError"
import { mailBuilder } from "@/utils/helpers/mailBuilder"
import { now, oneDayTTL, oneHour, oneHourTTL } from "@/utils/helpers/times"

const prepareModifyEmailRoutes: ApiRoutes = ({ app, db, redis }) => {
  const modifyEmail = new Hono()

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

  modifyEmail.put(
    "/modify-email",
    auth,
    zValidator("json", modifyEmailSchema),
    async (c: Context): Promise<Response> => {
      const requestBody = await c.req.json()
      const { email, password, newEmail }: ModifyEmail = requestBody

      const contextUser: UserModel = c.get(contextsKeys.user)

      const user = await UserModel.query().findOne({ email: contextUser.email })

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const modifyEmailDelay = redisKeys.users.modifyEmailDelay(
        contextUser.email
      )
      const modifyEmailDelayToken = await redis.get(modifyEmailDelay)

      if (modifyEmailDelayToken) {
        return c.json(usersMessages.emailAlreadyModify, SC.errors.BAD_REQUEST)
      }

      if (email !== contextUser.email) {
        return c.json(usersMessages.invalidEmail, SC.errors.BAD_REQUEST)
      }

      const validity = await user.checkPassword(password)

      if (!validity) {
        return c.json(authMessages.invalidPassword, SC.errors.BAD_REQUEST)
      }

      const userNewMail = await UserModel.query().findOne({ email: newEmail })

      if (userNewMail) {
        return c.json(usersMessages.emailAlreadyUse, SC.errors.BAD_REQUEST)
      }

      if (email === newEmail) {
        return c.json(usersMessages.emailSameAsPrevious, SC.errors.BAD_REQUEST)
      }

      const updatedUser = await UserModel.query()
        .where({ email: contextUser.email })
        .update({
          ...(newEmail ? { email: newEmail } : {}),
          emailValidation: false,
        })

      if (!updatedUser) {
        return c.json(usersMessages.userNotModified, SC.errors.NOT_FOUND)
      }

      const modifyEmailMail = await mailBuilder(
        {
          username: contextUser.username,
          email: contextUser.email,
          baseUrl: appConfig.sendgrid.baseUrl,
        },
        sgKeys.users.modifyEmail
      )

      const modifyNewEmailDelay = redisKeys.users.modifyEmailDelay(newEmail)

      const validationMail = await mailBuilder(
        { username: contextUser.username, email: newEmail },
        sgKeys.auth.emailValidation,
        oneHour,
        true
      )

      const emailTokenKey = redisKeys.auth.emailToken(
        validationMail.dynamic_template_data.token as string
      )

      await sgMail.send(modifyEmailMail)

      await sgMail.send(validationMail)

      await redis
        .multi()
        .set(modifyNewEmailDelay, now, "EX", oneDayTTL)
        .set(emailTokenKey, now, "EX", oneHourTTL)
        .exec()

      return c.json(SC.success.OK)
    }
  )

  modifyEmail.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/users", modifyEmail)
}

export default prepareModifyEmailRoutes
