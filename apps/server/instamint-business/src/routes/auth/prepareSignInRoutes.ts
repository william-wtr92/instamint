import { zValidator } from "@hono/zod-validator"
import { type ApiRoutes, SC } from "@instamint/server-types"
import {
  type SignIn,
  signInSchema,
  twoFactorSignInSchema,
  type TwoFactorSignIn,
  twoFactorSignInWithBackupCodeSchema,
  type TwoFactorSignInWithBackupCode,
} from "@instamint/shared-types"
import { type Context, Hono } from "hono"

import UserModel from "@/db/models/UserModel"
import {
  globalsMessages,
  authMessages,
  redisKeys,
  cookiesKeys,
  contextsKeys,
} from "@/def"
import { auth } from "@/middlewares/auth"
import { handleError } from "@/middlewares/handleError"
import { isAdmin } from "@/middlewares/perms"
import { sanitizeUser } from "@/utils/dto/sanitizeUsers"
import { throwInternalError } from "@/utils/errors/throwInternalError"
import { getCookie, setCookie } from "@/utils/helpers/actions/cookiesActions"
import { decodeJwt, signJwt } from "@/utils/helpers/actions/jwtActions"
import { checkAuthenticatorToken } from "@/utils/helpers/actions/twoFactorAuthActions"
import { oneDayTTL, thirtyDaysTTL } from "@/utils/helpers/times"

const prepareSignInRoutes: ApiRoutes = ({ app, db, redis }) => {
  const signIn = new Hono()

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

  signIn.post(
    "/sign-in",
    zValidator("json", signInSchema),
    async (c: Context): Promise<Response> => {
      const twoFactorCookie = await getCookie(c, cookiesKeys.auth.twoFactor)
      const requestBody: SignIn = await c.req.json()
      const { email, password }: SignIn = requestBody

      const user = await UserModel.query()
        .findOne({
          email,
        })
        .withGraphFetched("roleData")

      if (!user || !user.active) {
        return c.json(authMessages.emailNotExists, SC.errors.NOT_FOUND)
      }

      const validity = await user?.checkPassword(password)

      if (!validity) {
        return c.json(authMessages.invalidPassword, SC.errors.BAD_REQUEST)
      }

      if (user.twoFactorAuthentication) {
        if (!twoFactorCookie) {
          return c.json(
            authMessages.errorTwoFactorAuthRequired,
            SC.errors.UNAUTHORIZED
          )
        }

        const {
          payload: {
            user: { id },
          },
        } = await decodeJwt(twoFactorCookie)

        if (user.id !== id) {
          return c.json(
            authMessages.errorInvalidTwoFactorCookie,
            SC.errors.UNAUTHORIZED
          )
        }
      }

      const sessionKey = redisKeys.auth.authSession(email)

      const jwt = await signJwt({
        user: {
          id: user.id,
          email: user.email,
          role: user.roleData.right,
        },
      })

      await redis.set(sessionKey, jwt, "EX", oneDayTTL)

      await setCookie(c, cookiesKeys.auth.session, jwt)

      return c.json(
        { message: authMessages.signInSuccess.message },
        SC.success.OK
      )
    }
  )

  signIn.post(
    "/sign-in-2fa",
    zValidator("json", twoFactorSignInSchema),
    async (c: Context): Promise<Response> => {
      const { email, password, code, authorizeDevice }: TwoFactorSignIn =
        await c.req.json()

      const user = await UserModel.query()
        .findOne({ email })
        .withGraphFetched("roleData")

      if (!user || !user.active) {
        return c.json(authMessages.emailNotExists, SC.errors.NOT_FOUND)
      }

      if (!user.twoFactorAuthentication) {
        return c.json(
          authMessages.errorTwoFactorAuthNotEnabled,
          SC.errors.BAD_REQUEST
        )
      }

      const validity = await user?.checkPassword(password)

      if (!validity) {
        return c.json(authMessages.invalidPassword, SC.errors.BAD_REQUEST)
      }

      if (!user.secret || !code) {
        return c.json(
          authMessages.errorSecretOrCodeNotProvided,
          SC.errors.BAD_REQUEST
        )
      }

      const secret = user.secret
      const verified = checkAuthenticatorToken(code, secret)

      if (!verified) {
        return c.json(
          authMessages.errorTwoFactorAuthCodeNotValid,
          SC.errors.UNAUTHORIZED
        )
      }

      const sessionKey = redisKeys.auth.authSession(email)

      const jwt = await signJwt({
        user: {
          id: user.id,
          email: user.email,
          role: user.roleData.right,
        },
      })

      if (authorizeDevice) {
        const twoFactorToken = await signJwt({
          user: {
            id: user.id,
          },
        })

        await setCookie(
          c,
          cookiesKeys.auth.twoFactor,
          twoFactorToken,
          thirtyDaysTTL
        )
      }

      await redis.set(sessionKey, jwt, "EX", oneDayTTL)

      await setCookie(c, cookiesKeys.auth.session, jwt)

      return c.json(
        { message: authMessages.signInSuccess.message },
        SC.success.OK
      )
    }
  )

  signIn.post(
    "/sign-in-2fa-backup-code",
    zValidator("json", twoFactorSignInWithBackupCodeSchema),
    async (c: Context): Promise<Response> => {
      const { email, password, backupCode }: TwoFactorSignInWithBackupCode =
        await c.req.json()

      const user = await UserModel.query()
        .findOne({ email })
        .withGraphFetched("roleData")

      if (!user || !user.active) {
        return c.json(authMessages.emailNotExists, SC.errors.NOT_FOUND)
      }

      if (!user.twoFactorAuthentication) {
        return c.json(
          authMessages.errorTwoFactorAuthNotEnabled,
          SC.errors.BAD_REQUEST
        )
      }

      const validity = await user?.checkPassword(password)

      if (!validity) {
        return c.json(authMessages.invalidPassword, SC.errors.BAD_REQUEST)
      }

      if (!backupCode) {
        return c.json(
          authMessages.errorBackupCodeNotProvided,
          SC.errors.BAD_REQUEST
        )
      }

      if (!user.twoFactorBackupCodes) {
        return c.json(
          authMessages.errorUserHasNoBackupCodes,
          SC.errors.BAD_REQUEST
        )
      }

      const backupCodes = user.twoFactorBackupCodes
        .substring(1, user.twoFactorBackupCodes?.length - 1)
        .replaceAll('"', "")
        .split(",")

      if (!backupCodes.includes(backupCode)) {
        return c.json(
          authMessages.errorBackupCodeNotValid,
          SC.errors.UNAUTHORIZED
        )
      }

      const newBackupCodes = JSON.stringify(
        backupCodes.filter((code: string) => code !== backupCode)
      )

      await UserModel.query().patchAndFetchById(user.id, {
        twoFactorBackupCodes: newBackupCodes,
      })

      const sessionKey = redisKeys.auth.authSession(user.email)

      const jwt = await signJwt({
        user: {
          id: user.id,
          email: user.email,
          role: user.roleData.right,
        },
      })

      await redis.set(sessionKey, jwt, "EX", oneDayTTL)

      await setCookie(c, cookiesKeys.auth.session, jwt)

      return c.json(
        { message: authMessages.signInSuccess.message },
        SC.success.OK
      )
    }
  )

  signIn.get("/me", auth, async (c: Context): Promise<Response> => {
    const contextUser: UserModel = c.get(contextsKeys.user)

    if (!contextUser) {
      return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
    }

    const user = await UserModel.query().findOne({ email: contextUser.email })

    if (!user) {
      return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
    }

    return c.json(
      {
        message: authMessages.signedInUser.message,
        result: sanitizeUser(user, [
          "id",
          "bio",
          "link",
          "twoFactorAuthentication",
          "location",
          "avatar",
        ]),
      },
      SC.success.OK
    )
  })

  signIn.get(
    "/test-perms",
    auth,
    isAdmin,
    async (c: Context): Promise<Response> => {
      return c.json(
        {
          message: "You are an admin!",
        },
        SC.success.OK
      )
    }
  )

  signIn.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/auth", signIn)
}

export default prepareSignInRoutes
