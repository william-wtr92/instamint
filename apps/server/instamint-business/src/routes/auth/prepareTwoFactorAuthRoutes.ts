import { type Context, Hono } from "hono"
import { type ApiRoutes, SC } from "@instamint/server-types"
import { zValidator } from "@hono/zod-validator"
import {
  type ActivateTwoFactorAuth,
  type TwoFactorAuthenticate,
  activateTwoFactorAuthSchema,
  twoFactorAuthenticateSchema,
} from "@instamint/shared-types"

import {
  globalsMessages,
  authMessages,
  contextsKeys,
  usersMessages,
} from "@/def"
import { createErrorResponse } from "@/utils/errors/createErrorResponse"
import { auth } from "@/middlewares/auth"
import UserModel from "@/db/models/UserModel"
import {
  generateAuthenticatorToken,
  generateAuthenticatorURI,
  generateBackupCodes,
  generateSecret,
  verifyAuthenticatorToken,
} from "@/utils/helpers/twoFactorAuthActions"
import { generateQRCode } from "@/utils/helpers/qrCodeActions"

const prepareTwoFactorAuthRoutes: ApiRoutes = ({ app, db, redis }) => {
  const twoFactorAuth = new Hono()

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
          authMessages.twoFactorAuthAlreadyEnabled,
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

        const hotpUri = generateAuthenticatorURI(
          user.email,
          "Instamint",
          secret
        )
        const qrCode = await generateQRCode(hotpUri)

        await trx.commit()

        return c.json(
          {
            token,
            qrCode,
          },
          SC.success.OK
        )
      } catch (error) {
        await trx.rollback()
        throw createErrorResponse(
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
          authMessages.twoFactorAuthAlreadyEnabled,
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
          twoFactorBackupCodes: backupCodes,
        })

        await trx.commit()

        return c.json(
          { message: authMessages.twoFactorAuthActivated, backupCodes },
          SC.success.OK
        )
      } catch (error) {
        await trx.rollback()

        throw createErrorResponse(
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

        throw createErrorResponse(
          authMessages.errorDuringTwoFactorAuthDeactivation,
          SC.serverErrors.SERVICE_UNAVAILABLE
        )
      }
    }
  )

  app.route("/auth/2fa", twoFactorAuth)
}

export default prepareTwoFactorAuthRoutes
