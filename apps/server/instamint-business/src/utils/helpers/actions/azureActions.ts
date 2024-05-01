import { SC } from "@instamint/server-types"
import type { Context } from "hono"
import { type Dispatcher, FormData, request } from "undici"

import appConfig from "@/db/config/config"
import { usersMessages } from "@/def"

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
  const formData = new FormData()
  formData.append("image", image, image.name)

  const { ...response }: Dispatcher.ResponseData = await request(
    `${appConfig.microservices.files}${endpoint}`,
    {
      method: "POST",
      body: formData,
    }
  )

  if (response.statusCode !== SC.success.OK) {
    return c.json(usersMessages.avatarUploadFailed, SC.errors.BAD_REQUEST)
  }

  const responseBody = (await response.body.json()) as Response

  return { url: responseBody.url }
}

export const deleteBlob = async (
  c: Context,
  imageName: string,
  endpoint: string
) => {
  const { ...response }: Dispatcher.ResponseData = await request(
    `${appConfig.microservices.files}${endpoint}${imageName}`,
    {
      method: "DELETE",
    }
  )

  if (response.statusCode !== SC.success.OK) {
    return c.json(usersMessages.avatarDeleteFailed, SC.errors.BAD_REQUEST)
  }

  return { message: usersMessages.avatarDeleted.message }
}
