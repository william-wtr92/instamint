import { type Context, Hono } from "hono"
import { type ApiRoutes, SC } from "@instamint/server-types"

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
  generateHotpCode,
  generateHotpURI,
  generateSecret,
  verifyHotpCode,
} from "@/utils/helpers/twoFactorAuthActions"
import { generateQRCode } from "@/utils/helpers/qrCodeActions"
import { zValidator } from "@hono/zod-validator"
import type { ActivateTwoFactorAuth } from "@instamint/shared-types"
import { activateTwoFactorAuthSchema } from "@instamint/shared-types"

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
        const hotpCounter = await redis.incr("hotpCounter")

        await UserModel.query()
          .update({
            secret,
          })
          .where({ email: user.email })

        const token = generateHotpCode(secret, hotpCounter)

        const hotpUri = generateHotpURI(
          user.email,
          "Instamint",
          secret,
          hotpCounter
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
      const hotpCounter = Number(await redis.get("hotpCounter"))

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

      if (!hotpCounter) {
        return c.json(
          authMessages.errorHotpCounterNotAvailable,
          SC.errors.BAD_REQUEST
        )
      }

      const secret = user.secret
      const verified = verifyHotpCode(secret, code, hotpCounter)

      if (!verified) {
        return c.json(
          authMessages.errorTwoFactorAuthCodeNotValid,
          SC.errors.BAD_REQUEST
        )
      }

      const newSecret = generateSecret()

      await UserModel.query().patchAndFetchById(user.id, {
        twoFactorAuthentication: true,
        secret: newSecret,
      })

      return c.json(
        { message: authMessages.twoFactorAuthActivated },
        SC.success.OK
      )
    }
  )

  app.route("/auth/2fa", twoFactorAuth)
}

export default prepareTwoFactorAuthRoutes
