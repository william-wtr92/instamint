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
  userSchema,
  User,
  userMailValidationSchema,
  UserMailToken,
} from "@/utils/validators/users.validator"
import UserModel from "@/db/models/UserModel"
import { hashPassword } from "@/utils/hashPassword"
import { sanitizeUser, sanitizeUsers } from "@/utils/dto/sanitizeUsers"
import appConfig from "@/db/config/config"
import { auth } from "@/middlewares/auth"
import { isAdmin } from "@/middlewares/perms"
import { createErrorResponse } from "@/utils/errors/createErrorResponse"
import { rateLimiter } from "@/middlewares/rateLimiter"
import { handleError } from "@/middlewares/handleError"
import {
  databaseNotAvailable,
  emailOrUsernameAlreadyExist,
  errorDuringUserRegistration,
  rgpdValidationIsRequired,
  tokenNotProvided,
  userCreated,
  userMailValidated,
  userNotFound,
} from "@/utils/messages"
import { now } from "@/utils/times"
import { MailBuild } from "@/types/mails.types"
import { InsertedUser } from "@/types/users.types"
import { jwtTokenErrors } from "@/utils/errors/jwtTokenErrors"

const prepareUserRoutes: ApiRoutes = ({ app, db }) => {
  const users = new Hono()
  const usersAuth = new Hono()

  if (!db) {
    throw createErrorResponse(databaseNotAvailable, 500)
  }

  users.get("/", async (c: Context): Promise<Response> => {
    const users: UserModel[] = await UserModel.query()

    return c.json({ users: sanitizeUsers(users) }, 200)
  })

  users.post(
    "/",
    zValidator("json", userSchema),
    async (c: Context): Promise<Response> => {
      const requestBody: User = await c.req.json()
      const { username, email, password, rgpdValidation }: User = requestBody

      const emailExist = await db("users").where({ email }).first()
      const usernameExist = await db("users").where({ username }).first()

      if (emailExist || usernameExist) {
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

      const mailToken = await sign(
        {
          payload: {
            user: {
              email,
            },
          },
          exp: appConfig.security.jwt.expiresIn,
          nbf: now,
          iat: now,
        },
        appConfig.security.jwt.secret,
        "HS512"
      )

      sgMail.setApiKey(appConfig.sendgrid.apiKey)

      const sendGridMail: MailBuild<{ username: string; token: string }> = {
        to: email,
        from: appConfig.sendgrid.sender,
        templateId: "d-66e0b9564a2b499e92a61c4a358f3e6c",
        dynamic_template_data: { username, token: mailToken },
      }

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
    zValidator("json", userMailValidationSchema),
    async (c: Context): Promise<Response> => {
      const { token }: UserMailToken = await c.req.json()

      if (!token) {
        throw createErrorResponse(tokenNotProvided, 400)
      }

      try {
        const decodedToken = await verify(
          token,
          appConfig.security.jwt.secret,
          "HS512"
        )

        const email: string = decodedToken.payload.user.email

        const user = await db("users").where({ email }).first()

        if (!user) {
          return c.json({ message: userNotFound }, 404)
        }

        await db("users").where({ email }).update({ emailValidation: true })

        return c.json(
          {
            message: userMailValidated,
          },
          200
        )
      } catch (err) {
        throw jwtTokenErrors(err)
      }
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
