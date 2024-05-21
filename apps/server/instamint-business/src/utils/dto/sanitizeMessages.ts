import type MessageModel from "@/db/models/MessageModel"

export const sanitizeMessages = (messages: MessageModel[]) => {
  return messages.map((message) => {
    const { id, userId, content, createdAt }: MessageModel = message

    return { id, userId, content, createdAt }
  })
}
