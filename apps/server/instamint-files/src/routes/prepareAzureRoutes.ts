import { type ApiRoutes, SC } from "@instamint/server-types"
import { type Context, Hono } from "hono"
import { bodyLimit } from "hono/body-limit"
import mime from "mime"
import { v4 } from "uuid"

import { azureMessages, defaultMimeType, globalsMessages, oneGB } from "@/def"
import { createErrorResponse } from "@/utils/errors/createErrorResponse"

const prepareAzureRoutes: ApiRoutes = ({ app, azure }) => {
  const upload = new Hono()

  if (!azure) {
    throw createErrorResponse(
      globalsMessages.azureNotAvailable,
      SC.serverErrors.INTERNAL_SERVER_ERROR
    )
  }

  upload.post(
    "/upload",
    bodyLimit({
      maxSize: oneGB,
      onError: (c: Context) => {
        return c.json({
          message: "file too large",
          status: SC.errors.PAYLOAD_TOO_LARGE,
        })
      },
    }),
    async (c: Context): Promise<Response> => {
      const { image } = await c.req.parseBody()

      if (!(image instanceof File)) {
        return c.json(azureMessages.fileNotUploaded, SC.errors.BAD_REQUEST)
      }

      const imageName = `${v4()}-${image.name}`
      const mimeType = mime.getType(imageName) || defaultMimeType

      const blobHTTPHeaders = {
        blobContentType: mimeType,
      } as const

      const blob = azure.getBlockBlobClient(imageName)
      await blob.uploadData(await image.arrayBuffer(), {
        blobHTTPHeaders,
      })

      return c.json(
        {
          message: azureMessages.fileUploaded.message,
          url: `/${imageName}`,
          mimeType,
        },
        SC.success.OK
      )
    }
  )

  upload.delete("/delete/:imageName", async (c: Context): Promise<Response> => {
    const { imageName } = c.req.param()

    const blob = azure.getBlockBlobClient(imageName)

    if (!(await blob.exists())) {
      return c.json(azureMessages.fileNotFound, SC.errors.NOT_FOUND)
    }

    await blob.delete()

    return c.json(azureMessages.fileDeleted, SC.success.OK)
  })

  app.route("/azure", upload)
}

export default prepareAzureRoutes
