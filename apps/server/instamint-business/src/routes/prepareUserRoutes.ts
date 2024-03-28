import { type Context, Hono } from "hono"
import { sign, verify } from "hono/jwt"
import { zValidator } from "@hono/zod-validator"
import { type Dispatcher, request } from "undici"
import type { ApiRoutes } from "@instamint/server-types"
import sgMail from "@sendgrid/mail"

import {
  idSchema,
  loginSchema,
  type UserLogin,
} from "@/utils/validators/users.validator"
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
import { sanitizeUser, sanitizeUsers } from "@/utils/dto/sanitizeUsers"
import appConfig from "@/db/config/config"
import { auth } from "@/middlewares/auth"
import { isAdmin } from "@/middlewares/perms"
import { createErrorResponse } from "@/utils/errors/createErrorResponse"
import { rateLimiter } from "@/middlewares/rateLimiter"
import { handleError } from "@/middlewares/handleError"
import {
  databaseNotAvailable,
  emailNotExists,
  emailOrUsernameAlreadyExist,
  emailSent,
  errorDuringUserRegistration,
  redisNotAvailable,
  gdprValidationIsRequired,
  tokenNotProvided,
  userCreated,
  userEmailAlreadyValidated,
  userEmailValidated,
  userMustWaitBeforeSendingAnotherMail,
  userNotFound,
  tokenExpired,
} from "@/def/messages"
import {
  now,
  oneHour,
  oneHourNotBasedOnNow,
  tenMinutesNotBasedOnNow,
} from "@/utils/helpers/times"
import type { InsertedUser } from "@/types"
import { jwtTokenErrors } from "@/utils/errors/jwtTokenErrors"
import { mailBuilder } from "@/utils/helpers/mailBuilder"
import { redisKeys } from "@/def/redisKeys"

const prepareUserRoutes: ApiRoutes = ({ app, db, redis }) => {
  const users = new Hono()
  const usersAuth = new Hono()

  if (!db) {
    throw createErrorResponse(databaseNotAvailable, 500)
  }

  if (!redis) {
    throw createErrorResponse(redisNotAvailable, 500)
  }

  users.get("/", async (c: Context): Promise<Response> => {
    const users = await UserModel.query()

    return c.json({ users: sanitizeUsers(users) }, 200)
  })

  users.post(
    "/",
    zValidator("json", baseSignupSchema),
    async (c: Context): Promise<Response> => {
      const requestBody: SignUp = await c.req.json()
      const { username, email, password, gdprValidation }: SignUp = requestBody

      const userExistByEmail = await UserModel.query().findOne({ email })
      const userExistByUsername = await UserModel.query().findOne({ username })

      if (userExistByEmail || userExistByUsername) {
        return c.json(emailOrUsernameAlreadyExist, 400)
      }

      if (!gdprValidation) {
        return c.json(gdprValidationIsRequired, 400)
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
      const emailTokenKey = redisKeys.users.emailToken(
        sendGridMail.dynamic_template_data.token
      )

      const trx = await db.transaction()

      try {
        await trx("users").insert(newUser)

        await sgMail.send(sendGridMail)

        await redis.set(emailTokenKey, now, "EX", oneHourNotBasedOnNow)

        await trx.commit()

        return c.json({ ...userCreated, user: sanitizeUser(requestBody) }, 201)
      } catch (error) {
        await trx.rollback()

        throw createErrorResponse(errorDuringUserRegistration, 500)
      }
    }
  )

  users.post(
    "/emailValidation",
    zValidator("json", userEmailValidationSchema),
    async (c: Context): Promise<Response> => {
      const { validation }: UserEmailToken = await c.req.json()

      if (validation == null) {
        return c.json(tokenNotProvided, 400)
      }

      const emailTokenKey = redisKeys.users.emailToken(validation)
      const emailToken = await redis.get(emailTokenKey)

      if (!emailToken) {
        return c.json(tokenExpired, 400)
      }

      try {
        const decodedToken = await verify(
          validation,
          appConfig.security.jwt.secret,
          "HS512"
        )

        const email: string = decodedToken.payload.user.email

        const user = await UserModel.query().findOne({ email })

        if (!user) {
          return c.json(userNotFound, 404)
        }

        if (user.emailValidation) {
          return c.json(userEmailAlreadyValidated, 400)
        }

        await db("users").where({ email }).update({ emailValidation: true })

        await redis.del(emailTokenKey)

        return c.json(userEmailValidated, 200)
      } catch (err) {
        throw jwtTokenErrors(err)
      }
    }
  )

  users.post(
    "/resendEmailValidation",
    zValidator("json", userResendEmailValidationSchema),
    async (c: Context): Promise<Response> => {
      const { email }: UserResendEmail = await c.req.json()

      const cacheEmailValidationKey = redisKeys.users.emailValidation(email)
      const lastEmailValidation = await redis.get(cacheEmailValidationKey)

      if (lastEmailValidation) {
        return c.json(userMustWaitBeforeSendingAnotherMail, 429)
      }

      const user = await UserModel.query().findOne({ email })

      if (!user) {
        return c.json(emailNotExists, 400)
      }

      if (user.emailValidation) {
        return c.json(userEmailAlreadyValidated, 400)
      }

      const sendGridMail = await mailBuilder(
        {
          username: user.username,
          email: user.email,
        },
        oneHour
      )
      const emailTokenKey = redisKeys.users.emailToken(
        sendGridMail.dynamic_template_data.token
      )

      await sgMail.send(sendGridMail)

      await redis
        .multi()
        .set(cacheEmailValidationKey, now, "EX", tenMinutesNotBasedOnNow)
        .set(emailTokenKey, now, "EX", oneHourNotBasedOnNow)
        .exec()

      return c.json(emailSent, 200)
    }
  )

  usersAuth.get(
    "/:id",
    auth,
    isAdmin,
    zValidator("param", idSchema),
    async (c: Context): Promise<Response> => {
      const id: string = c.req.param("id")

      const user = await UserModel.query().findById(id)

      if (!user) {
        return c.json(userNotFound, 404)
      }

      return c.json(
        {
          message: `User email ${user.email}`,
        },
        201
      )
    }
  )

  users.post(
    "/login",
    zValidator("json", loginSchema),
    async (c: Context): Promise<Response> => {
      const requestBody: UserLogin = await c.req.json()
      const { email, password }: UserLogin = requestBody

      const user = await UserModel.query()
        .findOne({
          email,
        })
        .withGraphFetched("roleData")

      const validity = await user?.checkPassword(password)

      if (!user || !validity) {
        return c.json(emailNotExists, 400)
      }

      const jwt: string = await sign(
        {
          payload: {
            user: {
              id: user.id,
              email: user.email,
              role: user.roleData.right,
            },
          },
          exp: appConfig.security.jwt.expiresIn,
          nbf: now,
          iat: now,
        },
        appConfig.security.jwt.secret,
        "HS512"
      )

      return c.json(
        {
          jwt,
        },
        201
      )
    }
  )

  // eslint-disable-next-line no-warning-comments
  // TODO: this is a test route, remove it
  users.get(
    "/test-microservice",
    rateLimiter(5, 60),
    async (c: Context): Promise<Response> => {
      const { statusCode, headers, trailers, body }: Dispatcher.ResponseData =
        await request(appConfig.microservices.files)

      if (statusCode !== 200) {
        return c.json(
          {
            message: "Microservice not available",
          },
          404
        )
      }

      const data = await body.json()

      return c.json({ statusCode, headers, trailers, data })
    }
  )

  users.onError((e: Error, c: Context) => handleError(e, c))
  usersAuth.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/users", users)
  app.route("/users", usersAuth)
}

export default prepareUserRoutes
