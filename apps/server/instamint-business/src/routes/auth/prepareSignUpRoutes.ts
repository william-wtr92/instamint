import { zValidator } from "@hono/zod-validator"
import { type ApiRoutes, SC } from "@instamint/server-types"
import {
  baseSignupSchema,
  type SignUp,
  userEmailValidationSchema,
  type UserEmailToken,
  userResendEmailValidationSchema,
  type UserResendEmail,
} from "@instamint/shared-types"
import sgMail from "@sendgrid/mail"
import { type Context, Hono } from "hono"

import UserModel from "@/db/models/UserModel"
import {
  authMessages,
  globalsMessages,
  emailsMessages,
  redisKeys,
  sgKeys,
} from "@/def"
import { handleError } from "@/middlewares/handleError"
import type { InsertedUser } from "@/types"
import { sanitizeCreatedUser } from "@/utils/dto/sanitizeUsers"
import { jwtTokenErrors } from "@/utils/errors/jwtTokenErrors"
import { throwInternalError } from "@/utils/errors/throwInternalError"
import { decodeJwt } from "@/utils/helpers/actions/jwtActions"
import { hashPassword } from "@/utils/helpers/hashPassword"
import { mailBuilder } from "@/utils/helpers/mailBuilder"
import { now, oneHour, oneHourTTL, tenMinutesTTL } from "@/utils/helpers/times"

const prepareSignUpRoutes: ApiRoutes = ({ app, db, redis }) => {
  const signUp = new Hono()

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

  signUp.post(
    "/sign-up",
    zValidator("json", baseSignupSchema),
    async (c: Context): Promise<Response> => {
      const requestBody: SignUp = await c.req.json()
      const { username, email, password, gdprValidation }: SignUp = requestBody

      const userExistByEmail = await UserModel.query().findOne({ email })
      const userExistByUsername = await UserModel.query().findOne({ username })

      if (userExistByEmail || userExistByUsername) {
        return c.json(
          authMessages.emailOrUsernameAlreadyExist,
          SC.errors.BAD_REQUEST
        )
      }

      if (!gdprValidation) {
        return c.json(
          authMessages.gdprValidationIsRequired,
          SC.errors.BAD_REQUEST
        )
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

      const validationMail = await mailBuilder(
        { username, email },
        sgKeys.auth.emailValidation,
        oneHour,
        true
      )

      const emailTokenKey = redisKeys.auth.emailToken(
        validationMail.dynamic_template_data.token as string
      )

      try {
        await UserModel.query().insert(newUser)

        await sgMail.send(validationMail)

        await redis.set(emailTokenKey, now, "EX", oneHourTTL)

        return c.json(
          {
            message: authMessages.userCreated.message,
            result: sanitizeCreatedUser(requestBody),
          },
          SC.success.CREATED
        )
      } catch (error) {
        throw throwInternalError(
          authMessages.errorDuringUserRegistration,
          SC.serverErrors.SERVICE_UNAVAILABLE
        )
      }
    }
  )

  signUp.put(
    "/email-validation",
    zValidator("json", userEmailValidationSchema),
    async (c: Context): Promise<Response> => {
      const { validation }: UserEmailToken = await c.req.json()

      if (validation == null) {
        return c.json(globalsMessages.tokenNotProvided, SC.errors.BAD_REQUEST)
      }

      const emailTokenKey = redisKeys.auth.emailToken(validation)
      const emailToken = await redis.get(emailTokenKey)

      if (!emailToken) {
        return c.json(globalsMessages.tokenExpired, SC.errors.BAD_REQUEST)
      }

      try {
        const decodedToken = await decodeJwt(validation)

        const email: string = decodedToken.payload.user.email

        const user = await UserModel.query().findOne({ email })

        if (!user || !user.active) {
          return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
        }

        if (user.emailValidation) {
          return c.json(
            authMessages.userEmailAlreadyValidated,
            SC.errors.BAD_REQUEST
          )
        }

        await UserModel.query()
          .where({ email })
          .update({ emailValidation: true })

        await redis.del(emailTokenKey)

        return c.json(
          { message: authMessages.userEmailValidated.message },
          SC.success.OK
        )
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
        return c.json(
          emailsMessages.userMustWaitBeforeSendingAnotherMail,
          SC.errors.TOO_MANY_REQUESTS
        )
      }

      const user = await UserModel.query().findOne({ email })

      if (!user || !user.active) {
        return c.json(authMessages.emailNotExists, SC.errors.NOT_FOUND)
      }

      if (user.emailValidation) {
        return c.json(
          authMessages.userEmailAlreadyValidated,
          SC.errors.BAD_REQUEST
        )
      }

      const resendValidationMail = await mailBuilder(
        {
          username: user.username,
          email: user.email,
        },
        sgKeys.auth.emailValidation,
        oneHour,
        true
      )
      const emailTokenKey = redisKeys.auth.emailToken(
        resendValidationMail.dynamic_template_data.token as string
      )

      await sgMail.send(resendValidationMail)

      await redis
        .multi()
        .set(cacheEmailValidationKey, now, "EX", tenMinutesTTL)
        .set(emailTokenKey, now, "EX", oneHourTTL)
        .exec()

      return c.json(
        { message: emailsMessages.emailSent.message },
        SC.success.OK
      )
    }
  )

  signUp.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/auth", signUp)
}

export default prepareSignUpRoutes
