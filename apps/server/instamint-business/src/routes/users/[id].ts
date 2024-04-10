import { type Context, Hono } from "hono"
import { type ApiRoutes, SC } from "@instamint/server-types"
import { createErrorResponse } from "@/utils/errors/createErrorResponse"
import { authMessages, globalsMessages, redisKeys, sgKeys } from "@/def"
import { handleError } from "@/middlewares/handleError"
import UserModel from "@/db/models/UserModel"
import { sanitizeUser } from "@/utils/dto/sanitizeUsers"
import {
  type UsernameEmailSettingsSchema,
  usernameEmailSettingsSchema,
} from "@instamint/shared-types"
import { zValidator } from "@hono/zod-validator"
import { mailBuilder } from "@/utils/helpers/mailBuilder"
import { now, oneHour, oneHourTTL } from "@/utils/helpers/times"
import sgMail from "@sendgrid/mail"

const prepareUserActionRoute: ApiRoutes = ({ app, db, redis }) => {
  const userAction = new Hono()

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

  userAction.get("/:id", async (c: Context): Promise<Response> => {
    const id = c.req.param("id")

    const user = await UserModel.query().findOne({ id })

    if (!user) {
      return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
    }

    return c.json({ user: sanitizeUser(user) }, SC.success.OK)
  })

  userAction.put(
    "/:id",
    zValidator("json", usernameEmailSettingsSchema),
    async (c: Context): Promise<Response> => {
      const id = c.req.param("id")
      const requestBody = await c.req.json()
      const { username, email }: UsernameEmailSettingsSchema = requestBody
      const query = UserModel.query()
      const user = await query.findOne({ id })

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      if (user.username !== username) {
        const existUsername = await query.findOne({ username })

        if (existUsername) {
          return c.json(
            authMessages.emailOrUsernameAlreadyExist,
            SC.errors.BAD_REQUEST
          )
        }
      } else if (user.email !== email) {
        const existEmail = await query.findOne({ email })

        if (existEmail) {
          return c.json(
            authMessages.emailOrUsernameAlreadyExist,
            SC.errors.BAD_REQUEST
          )
        } else {
          const validationMail = await mailBuilder(
            { username, email },
            sgKeys.auth.emailValidation,
            oneHour,
            true
          )

          const emailTokenKey = redisKeys.auth.emailToken(
            validationMail.dynamic_template_data.token as string
          )

          await sgMail.send(validationMail)

          await redis.set(emailTokenKey, now, "EX", oneHourTTL)

          await db("users").where({ id }).update({ emailValidation: false })
        }
      }

      const update = await UserModel.query().updateAndFetchById(id, {
        ...(username ? { username } : {}),
        ...(email ? { email } : {}),
      })

      if (!update) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      return c.json({ user: sanitizeUser(update) }, SC.success.OK)
    }
  )

  userAction.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/users", userAction)
}

export default prepareUserActionRoute
