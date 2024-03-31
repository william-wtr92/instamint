import { type Context, Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import type { ApiRoutes } from "@instamint/server-types"
import sgMail from "@sendgrid/mail"
import {
  baseSignupSchema,
  type SignUp,
  userEmailValidationSchema,
  type UserEmailToken,
  userResendEmailValidationSchema,
  type UserResendEmail,
} from "@instamint/shared-types"

import UserModel from "@/db/models/UserModel"
import { hashPassword } from "@/utils/helpers/hashPassword"
import { sanitizeCreatedUser } from "@/utils/dto/sanitizeUsers"
import { createErrorResponse } from "@/utils/errors/createErrorResponse"
import { handleError } from "@/middlewares/handleError"
import { authMessages, globalsMessages, emailsMessages, redisKeys } from "@/def"
import {
  now,
  oneHour,
  oneHourNotBasedOnNow,
  tenMinutesNotBasedOnNow,
} from "@/utils/helpers/times"
import type { InsertedUser } from "@/types"
import { jwtTokenErrors } from "@/utils/errors/jwtTokenErrors"
import { mailBuilder } from "@/utils/helpers/mailBuilder"
import { decodeJwt } from "@/utils/helpers/jwtActions"

const prepareSignUpRoutes: ApiRoutes = ({ app, db, redis }) => {
  const signUp = new Hono()

  if (!db) {
    throw createErrorResponse(globalsMessages.databaseNotAvailable, 500)
  }

  if (!redis) {
    throw createErrorResponse(globalsMessages.redisNotAvailable, 500)
  }

  signUp.post(
    "/sign-up",
    zValidator("json", baseSignupSchema),
    async (c: Context): Promise<Response> => {
      const requestBody: SignUp = await c.req.json()
      const { username, email, password, gdprValidation }: SignUp = requestBody

      const userExistByEmail = await UserModel.query().findOne({ email })
      const userExistByUsername = await UserModel.query().findOne({ username })

      if (userExistByEmail || userExistByUsername) {
        return c.json(authMessages.emailOrUsernameAlreadyExist, 400)
      }

      if (!gdprValidation) {
        return c.json(authMessages.gdprValidationIsRequired, 400)
      }

      const [passwordHash, passwordSalt]: string[] =
        await hashPassword(password)

      const newUser: InsertedUser = {
        username,
        email,
        passwordHash,
        passwordSalt,
        gdprValidation,
      }

      const sendGridMail = await mailBuilder({ username, email }, oneHour)
      const emailTokenKey = redisKeys.auth.emailToken(
        sendGridMail.dynamic_template_data.token
      )

      try {
        await db("users").insert(newUser)

        await sgMail.send(sendGridMail)

        await redis.set(emailTokenKey, now, "EX", oneHourNotBasedOnNow)

        return c.json(
          {
            message: authMessages.userCreated.message,
            result: sanitizeCreatedUser(requestBody),
          },
          201
        )
      } catch (error) {
        throw createErrorResponse(authMessages.errorDuringUserRegistration, 500)
      }
    }
  )

  signUp.put(
    "/email-validation",
    zValidator("json", userEmailValidationSchema),
    async (c: Context): Promise<Response> => {
      const { validation }: UserEmailToken = await c.req.json()

      if (validation == null) {
        return c.json(globalsMessages.tokenNotProvided, 400)
      }

      const emailTokenKey = redisKeys.auth.emailToken(validation)
      const emailToken = await redis.get(emailTokenKey)

      if (!emailToken) {
        return c.json(globalsMessages.tokenExpired, 400)
      }

      try {
        const decodedToken = await decodeJwt(validation)

        const email: string = decodedToken.payload.user.email

        const user = await UserModel.query().findOne({ email })

        if (!user) {
          return c.json(authMessages.userNotFound, 404)
        }

        if (user.emailValidation) {
          return c.json(authMessages.userEmailAlreadyValidated, 400)
        }

        await db("users").where({ email }).update({ emailValidation: true })

        await redis.del(emailTokenKey)

        return c.json({ message: authMessages.userEmailValidated.message }, 200)
      } catch (err) {
        throw jwtTokenErrors(err)
      }
    }
  )

  signUp.post(
    "/resend-email-validation",
    zValidator("json", userResendEmailValidationSchema),
    async (c: Context): Promise<Response> => {
      const { email }: UserResendEmail = await c.req.json()

      const cacheEmailValidationKey = redisKeys.auth.emailValidation(email)
      const lastEmailValidation = await redis.get(cacheEmailValidationKey)

      if (lastEmailValidation) {
        return c.json(emailsMessages.userMustWaitBeforeSendingAnotherMail, 429)
      }

      const user = await UserModel.query().findOne({ email })

      if (!user) {
        return c.json(authMessages.emailNotExists, 400)
      }

      if (user.emailValidation) {
        return c.json(authMessages.userEmailAlreadyValidated, 400)
      }

      const sendGridMail = await mailBuilder(
        {
          username: user.username,
          email: user.email,
        },
        oneHour
      )
      const emailTokenKey = redisKeys.auth.emailToken(
        sendGridMail.dynamic_template_data.token
      )

      await sgMail.send(sendGridMail)

      await redis
        .multi()
        .set(cacheEmailValidationKey, now, "EX", tenMinutesNotBasedOnNow)
        .set(emailTokenKey, now, "EX", oneHourNotBasedOnNow)
        .exec()

      return c.json({ message: emailsMessages.emailSent.message }, 200)
    }
  )

  signUp.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/auth", signUp)
}

export default prepareSignUpRoutes
