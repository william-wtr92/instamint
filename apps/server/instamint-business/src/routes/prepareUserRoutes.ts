import { Context, Hono } from "hono"
import { sign } from "hono/jwt"
import { zValidator } from "@hono/zod-validator"
import { Dispatcher, request } from "undici"
import { ApiRoutes } from "@instamint/server-types"

import {
  idSchema,
  loginSchema,
  UserLogin,
  userSchema,
  User,
} from "@/utils/validators/user.validator"
import UserModel from "@/db/models/UserModel"
import { hashPassword } from "@/utils/hashPassword"
import { sanitizeUser, sanitizeUsers } from "@/utils/dto/sanitizeUser"
import configDb from "@/db/config/config"
import { auth } from "@/middlewares/auth"
import { perms } from "@/middlewares/perms"
import { createErrorResponse } from "@/utils/errors"
import { rateLimiter } from "@/middlewares/rateLimiter"
import { handleError } from "@/middlewares/handleError"

const prepareUserRoutes: ApiRoutes = ({ app, db }): void => {
  const user: Hono = new Hono()
  const userAuth: Hono = new Hono()

  if (!db) {
    throw createErrorResponse("Database not available", 500)
  }

  user.get("/all", async (c: Context): Promise<Response> => {
    const users: UserModel[] = await UserModel.query()

    return c.json({ users: sanitizeUsers(users) }, 200)
  })

  user.post(
    "/",
    zValidator("json", userSchema),
    async (c: Context): Promise<Response> => {
      const requestBody: User = await c.req.json()
      const { email, password, firstname, lastname, roleId }: User = requestBody

      const userExist: UserModel | undefined = await UserModel.query().findOne({
        email,
      })

      if (userExist) {
        return c.json({ message: "User already exist" }, 400)
      }

      const [passwordHash, passwordSalt]: string[] =
        await hashPassword(password)
      const parseRoleId: number = parseInt(roleId, 10)

      await db("user").insert({
        email,
        passwordHash,
        passwordSalt,
        firstname,
        lastname,
        roleId: parseRoleId,
      })

      return c.json(
        {
          user: sanitizeUser(requestBody),
          message: "User created",
        },
        201
      )
    }
  )

  userAuth.get(
    "/:id",
    auth,
    perms,
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

  user.post(
    "/login",
    zValidator("json", loginSchema),
    async (c: Context): Promise<Response> => {
      const now: number = Math.floor(Date.now() / 1000)

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
          exp: configDb.security.jwt.expiresIn,
          nbf: now,
          iat: now,
        },
        configDb.security.jwt.secret,
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
  user.get(
    "/test-microservice",
    rateLimiter(5, 60),
    async (c: Context): Promise<Response> => {
      const { statusCode, headers, trailers, body }: Dispatcher.ResponseData =
        await request(configDb.microservices.files)

      if (statusCode !== 200) {
        throw createErrorResponse("Microservice error", statusCode)
      }

      const data = await body.json()

      return c.json({ statusCode, headers, trailers, data })
    }
  )

  user.onError((e: Error, c: Context) => handleError(e, c))
  userAuth.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/user", user)
  app.route("/user", userAuth)
}

export default prepareUserRoutes
