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
import { throwInternalError } from "@/utils/errors/throwInternalError"
import { uploadBlob } from "@/utils/helpers/actions/azureActions"
import { tenMB } from "@/utils/helpers/files"

const prepareUploadPublicationRoutes: ApiRoutes = ({ app, db, redis }) => {
  const uploadPublication = new Hono()

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

  uploadPublication.post(
    "/upload-publication",
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
      const { image, description } = await c.req.parseBody()

      if (!contextUser) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const user = await UserModel.query().findOne({ email: contextUser.email })

      if (!user) {
        return c.json(authMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      if (!(image instanceof File)) {
        return c.json(
          usersMessages.publicationUploadFailed,
          SC.errors.BAD_REQUEST
        )
      }

      const response = await uploadBlob(c, image, filesServiceEndpoints.upload)

      await db("publications").insert({ userId: user.id, image: response.url, description: description })

      return c.json(
        {
          message: usersMessages.publicationUploaded.message,
        },
        SC.success.OK
      )
    }
  )

  app.route("/users", uploadPublication)
}

export default prepareUploadPublicationRoutes
