import { zValidator } from "@hono/zod-validator"
import { type ApiRoutes, SC } from "@instamint/server-types"
import {
  modifyPasswordSchema,
  type ModifyPassword,
} from "@instamint/shared-types"
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
import { hashPassword } from "@/utils/helpers/hashPassword"
import { mailBuilder } from "@/utils/helpers/mailBuilder"
import { now, oneDayTTL } from "@/utils/helpers/times"

const prepareModifyPasswordRoutes: ApiRoutes = ({ app, db, redis }) => {
  const modifyPassword = new Hono()

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

  modifyPassword.put(
    "/modify-password",
    auth,
    zValidator("json", modifyPasswordSchema),
    async (c: Context): Promise<Response> => {
      const requestBody = await c.req.json()
      const { oldPassword, newPassword, confirmNewPassword }: ModifyPassword =
        requestBody

      const contextUser: UserModel = c.get(contextsKeys.user)

      const user = await UserModel.query().findOne({ email: contextUser.email })

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const modifyPasswordDelay = redisKeys.users.modifyPasswordDelay(
        contextUser.email
      )
      const modifyPasswordDelayToken = await redis.get(modifyPasswordDelay)

      if (modifyPasswordDelayToken) {
        return c.json(
          usersMessages.passwordAlreadyModify,
          SC.errors.BAD_REQUEST
        )
      }

      if (oldPassword === newPassword) {
        return c.json(
          usersMessages.passwordSameAsPrevious,
          SC.errors.BAD_REQUEST
        )
      }

      const validity = await user.checkPassword(oldPassword)

      if (!validity) {
        return c.json(authMessages.invalidPassword, SC.errors.BAD_REQUEST)
      }

      if (newPassword !== confirmNewPassword) {
        return c.json(usersMessages.passwordsMustMatch, SC.errors.BAD_REQUEST)
      }

      const [passwordHash, passwordSalt]: string[] =
        await hashPassword(newPassword)

      const updatedUser = await UserModel.query()
        .where({ email: contextUser.email })
        .update({
          ...(passwordHash ? { passwordHash } : {}),
          ...(passwordSalt ? { passwordSalt } : {}),
        })

      if (!updatedUser) {
        return c.json(usersMessages.userNotModified, SC.errors.NOT_FOUND)
      }

      await redis.set(modifyPasswordDelay, now, "EX", oneDayTTL)

      const modifyPasswordMail = await mailBuilder(
        {
          username: contextUser.username,
          email: contextUser.email,
          baseUrl: appConfig.sendgrid.baseUrl,
        },
        sgKeys.users.modifyPassword
      )

      await sgMail.send(modifyPasswordMail)

      return c.json(SC.success.OK)
    }
  )

  modifyPassword.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/users", modifyPassword)
}

export default prepareModifyPasswordRoutes
