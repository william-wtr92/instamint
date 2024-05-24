import { zValidator } from "@hono/zod-validator"
import { type ApiRoutes, SC } from "@instamint/server-types"
import {
  type ActivateTwoFactorAuth,
  type TwoFactorAuthenticate,
  activateTwoFactorAuthSchema,
  twoFactorAuthenticateSchema,
} from "@instamint/shared-types"
import { type Context, Hono } from "hono"

import UserModel from "@/db/models/UserModel"
import {
  globalsMessages,
  authMessages,
  contextsKeys,
  usersMessages,
} from "@/def"
import { auth } from "@/middlewares/auth"
import { handleError } from "@/middlewares/handleError"
import { throwInternalError } from "@/utils/errors/throwInternalError"
import { generateQRCode } from "@/utils/helpers/actions/qrCodeActions"
import {
  generateAuthenticatorToken,
  generateAuthenticatorURI,
  generateBackupCodes,
  generateSecret,
  verifyAuthenticatorToken,
} from "@/utils/helpers/actions/twoFactorAuthActions"

const prepareTwoFactorAuthRoutes: ApiRoutes = ({ app, db, redis }) => {
  const twoFactorAuth = new Hono()

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

  twoFactorAuth.post(
    "/authenticate",
    auth,
    zValidator("json", twoFactorAuthenticateSchema),
    async (c: Context): Promise<Response> => {
      const { password }: TwoFactorAuthenticate = await c.req.json()
      const contextUser: UserModel = c.get(contextsKeys.user)
      const user = await UserModel.query().findOne({
        email: contextUser.email,
      })

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      if (!user.active) {
        return c.json(
          usersMessages.accountAlreadyDeactivated,
          SC.errors.BAD_REQUEST
        )
      }

      const isRightPassword = await user?.checkPassword(password)

      if (!isRightPassword) {
        return c.json(authMessages.invalidPassword, SC.errors.BAD_REQUEST)
      }

      return c.json(
        {
          message: authMessages.twoFactorAuthSuccess,
        },
        SC.success.OK
      )
    }
  )

  twoFactorAuth.get(
    "/generate",
    auth,
    async (c: Context): Promise<Response> => {
      const contextUser: UserModel = c.get(contextsKeys.user)
      const user = await UserModel.query().findOne({ email: contextUser.email })

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      if (!user.active) {
        return c.json(
          usersMessages.accountAlreadyDeactivated,
          SC.errors.BAD_REQUEST
        )
      }

      if (user.twoFactorAuthentication) {
        return c.json(
          authMessages.errorTwoFactorAuthAlreadyEnabled,
          SC.errors.BAD_REQUEST
        )
      }

      const trx = await db.transaction()

      try {
        const secret = generateSecret()

        await UserModel.query()
          .update({
            secret,
          })
          .where({ email: user.email })

        const token = generateAuthenticatorToken(secret)
        const issuer = "Instamint"

        const hotpUri = generateAuthenticatorURI(user.email, issuer, secret)
        const qrCode = await generateQRCode(hotpUri)

        await trx.commit()

        return c.json(
          {
            result: {
              token,
              qrCode,
            },
          },
          SC.success.OK
        )
      } catch (error) {
        await trx.rollback()
        throw throwInternalError(
          authMessages.errorDuringHotpGeneration,
          SC.serverErrors.SERVICE_UNAVAILABLE
        )
      }
    }
  )

  twoFactorAuth.post(
    "/activate",
    auth,
    zValidator("json", activateTwoFactorAuthSchema),
    async (c: Context): Promise<Response> => {
      const { code }: ActivateTwoFactorAuth = await c.req.json()
      const contextUser: UserModel = c.get(contextsKeys.user)
      const user = await UserModel.query().findOne({ email: contextUser.email })

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      if (!user.active) {
        return c.json(
          usersMessages.accountAlreadyDeactivated,
          SC.errors.BAD_REQUEST
        )
      }

      if (user.twoFactorAuthentication) {
        return c.json(
          authMessages.errorTwoFactorAuthAlreadyEnabled,
          SC.errors.BAD_REQUEST
        )
      }

      if (!user.secret || !code) {
        return c.json(
          authMessages.errorSecretOrCodeNotProvided,
          SC.errors.BAD_REQUEST
        )
      }

      const trx = await db.transaction()

      try {
        const secret = user.secret
        const verified = verifyAuthenticatorToken(code, secret)

        if (!verified) {
          return c.json(
            authMessages.errorTwoFactorAuthCodeNotValid,
            SC.errors.BAD_REQUEST
          )
        }

        const backupCodes = generateBackupCodes()

        await UserModel.query().patchAndFetchById(user.id, {
          twoFactorAuthentication: true,
          twoFactorBackupCodes: JSON.stringify(backupCodes),
        })

        await trx.commit()

        return c.json(
          {
            message: authMessages.twoFactorAuthActivated,
            result: { backupCodes },
          },
          SC.success.OK
        )
      } catch (error) {
        await trx.rollback()

        throw throwInternalError(
          authMessages.errorDuringTwoFactorAuthActivation,
          SC.serverErrors.SERVICE_UNAVAILABLE
        )
      }
    }
  )

  twoFactorAuth.put(
    "/deactivate",
    auth,
    zValidator("json", activateTwoFactorAuthSchema),
    async (c: Context): Promise<Response> => {
      const { code }: ActivateTwoFactorAuth = await c.req.json()
      const contextUser: UserModel = c.get(contextsKeys.user)
      const user = await UserModel.query().findOne({
        email: contextUser.email,
      })

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      if (!user.active) {
        return c.json(
          usersMessages.accountAlreadyDeactivated,
          SC.errors.BAD_REQUEST
        )
      }

      if (!user.twoFactorAuthentication) {
        return c.json(
          authMessages.errorTwoFactorAuthNotEnabled,
          SC.errors.BAD_REQUEST
        )
      }

      if (!user.secret || !code) {
        return c.json(
          authMessages.errorSecretOrCodeNotProvided,
          SC.errors.BAD_REQUEST
        )
      }

      const trx = await db.transaction()

      try {
        const secret = user.secret
        const verified = verifyAuthenticatorToken(code, secret)

        if (!verified) {
          return c.json(
            authMessages.errorTwoFactorAuthCodeNotValid,
            SC.errors.BAD_REQUEST
          )
        }

        await UserModel.query().patchAndFetchById(user.id, {
          twoFactorAuthentication: false,
          secret: null,
          twoFactorBackupCodes: null,
        })

        await trx.commit()

        return c.json(
          { message: authMessages.twoFactorAuthDeactivated },
          SC.success.OK
        )
      } catch (error) {
        await trx.rollback()

        throw throwInternalError(
          authMessages.errorDuringTwoFactorAuthDeactivation,
          SC.serverErrors.SERVICE_UNAVAILABLE
        )
      }
    }
  )

  twoFactorAuth.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/auth/2fa", twoFactorAuth)
}

export default prepareTwoFactorAuthRoutes
