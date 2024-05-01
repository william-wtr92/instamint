import { type ApiRoutes, SC } from "@instamint/server-types"
import { type Context, Hono } from "hono"
import { bodyLimit } from "hono/body-limit"

import UserModel from "@/db/models/UserModel"
import {
  authMessages,
  contextsKeys,
  filesServiceEndpoints,
  globalsMessages,
  usersMessages,
} from "@/def"
import { auth } from "@/middlewares/auth"
import { createErrorResponse } from "@/utils/errors/createErrorResponse"
import { deleteBlob, uploadBlob } from "@/utils/helpers/actions/azureActions"
import { tenMB } from "@/utils/helpers/files"

const prepareUploadAvatarRoutes: ApiRoutes = ({ app, db, redis }) => {
  const uploadAvatar = new Hono()

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

  uploadAvatar.post(
    "/upload-avatar",
    auth,
    bodyLimit({
      maxSize: tenMB,
      onError: (c: Context) => {
        return c.json(
          usersMessages.avatarSizeTooLarge,
          SC.errors.PAYLOAD_TOO_LARGE
        )
      },
    }),
    async (c: Context): Promise<Response> => {
      const contextUser: UserModel = c.get(contextsKeys.user)
      const { image } = await c.req.parseBody()

      if (!contextUser) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const user = await UserModel.query().findOne({ email: contextUser.email })

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      if (user.avatar) {
        await deleteBlob(c, user.avatar, filesServiceEndpoints.delete)
      }

      if (!(image instanceof File)) {
        return c.json(usersMessages.avatarUploadFailed, SC.errors.BAD_REQUEST)
      }

      const response = await uploadBlob(c, image, filesServiceEndpoints.upload)

      await UserModel.query()
        .where({ email: user.email })
        .update({
          ...(response.url ? { avatar: response.url } : {}),
        })

      return c.json(
        {
          message: usersMessages.avatarUploaded.message,
        },
        SC.success.OK
      )
    }
  )

  app.route("/users", uploadAvatar)
}

export default prepareUploadAvatarRoutes
