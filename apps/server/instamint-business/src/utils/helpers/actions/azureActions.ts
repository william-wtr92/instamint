import { SC } from "@instamint/server-types"
import type { Context } from "hono"
import { type Dispatcher, FormData, request } from "undici"

import appConfig from "@/db/config/config"
import { globalsMessages, usersMessages } from "@/def"

type Response = {
  message: string
  url: string
  mimeType: string
}

export const uploadBlob = async <T extends File>(
  c: Context,
  image: T,
  endpoint: string
): Promise<{ url: string } | Response> => {
  try {
    const formData = new FormData()
    formData.append("image", image, image.name)

    const { ...response }: Dispatcher.ResponseData = await request(
      `${appConfig.microservices.files}${endpoint}`,
      {
        method: "POST",
        body: formData,
      }
    )

    const responseBody = (await response.body.json()) as Response

    return { url: responseBody.url }
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes(globalsMessages.fileSizeTooLarge.message)
    ) {
      return c.json(
        globalsMessages.fileSizeTooLarge,
        SC.errors.PAYLOAD_TOO_LARGE
      )
    }

    return c.json({
      message: usersMessages.uploadFailed,
      status: SC.serverErrors.INTERNAL_SERVER_ERROR,
    })
  }
}

export const deleteBlob = async (
  c: Context,
  imageName: string,
  endpoint: string
) => {
  try {
    await request(`${appConfig.microservices.files}${endpoint}${imageName}`, {
      method: "DELETE",
    })

    return { message: usersMessages.avatarDeleted.message }
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes(globalsMessages.fileNotFound.message)
    ) {
      return c.json(globalsMessages.fileNotFound, SC.errors.NOT_FOUND)
    }

    return c.json(usersMessages.avatarDeleteFailed, SC.errors.BAD_REQUEST)
  }
}
