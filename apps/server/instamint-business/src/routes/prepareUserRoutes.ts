import { Context, Hono } from "hono"
import { sign, verify } from "hono/jwt"
import { zValidator } from "@hono/zod-validator"
import { Dispatcher, request } from "undici"
import { ApiRoutes } from "@instamint/server-types"
import sgMail from "@sendgrid/mail"

import {
  idSchema,
  loginSchema,
  UserLogin,
} from "@/utils/validators/users.validator"
import {
  baseSignupSchema,
  SignUpTypes,
  userEmailValidationSchema,
  UserEmailToken,
  userResendEmailValidationSchema,
  UserResendEmail,
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
  rgpdValidationIsRequired,
  tokenNotProvided,
  userCreated,
  userEmailAlreadyValidated,
  userEmailValidated,
  userNotFound,
} from "@/utils/messages"
import { now } from "@/utils/helpers/times"
import { InsertedUser } from "@/types"
import { jwtTokenErrors } from "@/utils/errors/jwtTokenErrors"
import { mailBuilder } from "@/utils/helpers/mailBuilder"

const prepareUserRoutes: ApiRoutes = ({ app, db }) => {
  const users = new Hono()
  const usersAuth = new Hono()

  if (!db) {
    throw createErrorResponse(databaseNotAvailable, 500)
  }

  users.get("/", async (c: Context): Promise<Response> => {
    const users = await UserModel.query()

    return c.json({ users: sanitizeUsers(users) }, 200)
  })

  users.post(
    "/",
    zValidator("json", baseSignupSchema),
    async (c: Context): Promise<Response> => {
      const requestBody: SignUpTypes = await c.req.json()
      const { username, email, password, rgpdValidation }: SignUpTypes =
        requestBody

      const userExist = await UserModel.query().findOne({ email, username })

      if (userExist) {
        return c.json({ message: emailOrUsernameAlreadyExist }, 400)
      }

      if (!rgpdValidation) {
        return c.json({ message: rgpdValidationIsRequired }, 400)
      }

      const [passwordHash, passwordSalt]: string[] =
        await hashPassword(password)

      const newUser: InsertedUser = {
        username,
        email,
        passwordHash,
        passwordSalt,
        rgpdValidation,
      }

      const sendGridMail = await mailBuilder({ username, email })

      const trx = await db.transaction()

      try {
        await trx("users").insert(newUser)

        await sgMail.send(sendGridMail)

        await trx.commit()

        return c.json(
          {
            user: sanitizeUser(requestBody),
            message: userCreated,
          },
          201
        )
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
        throw createErrorResponse(tokenNotProvided, 400)
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
          return c.json({ message: userNotFound }, 404)
        }

        if (user.emailValidation) {
          return c.json({ message: userEmailAlreadyValidated }, 400)
        }

        await db("users").where({ email }).update({ emailValidation: true })

        return c.json(
          {
            message: userEmailValidated,
          },
          200
        )
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

      const user = await UserModel.query().findOne({ email })

      if (!user) {
        return c.json({ message: emailNotExists }, 400)
      }

      if (user.emailValidation) {
        return c.json({ message: userEmailAlreadyValidated }, 400)
      }

      const sendGridMail = await mailBuilder({
        username: user.username,
        email: user.email,
      })

      await sgMail.send(sendGridMail)

      return c.json(
        {
          message: emailSent,
        },
        200
      )
    }
  )

  usersAuth.get(
    "/:id",
    auth,
    isAdmin,
    zValidator("param", idSchema),
    async (c: Context): Promise<Response> => {
      const id: string = c.req.param("id")

      const user: UserModel | undefined = await UserModel.query().findById(id)

      if (!user) {
        throw createErrorResponse("User not found", 404)
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

      const user: UserModel | undefined = await UserModel.query()
        .findOne({
          email,
        })
        .withGraphFetched("roleData")

      const validity: boolean | undefined = await user?.checkPassword(password)

      if (!user || !validity) {
        throw createErrorResponse("Invalid email or password", 401)
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
        throw createErrorResponse("Microservice error", statusCode)
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
