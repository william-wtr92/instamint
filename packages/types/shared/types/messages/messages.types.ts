import { z } from "zod"

export const joinRoomSchema = z.object({
  userTargetedUsername: z.string(),
})

export const chatMessageSchema = z.object({
  room: z.string(),
  message: z.string().min(1).max(1000),
})

export const getMessagesSchema = z.object({
  roomName: z.string(),
  limit: z.string().default("20"),
  offset: z.string().default("0"),
})

export type JoinRoom = z.infer<typeof joinRoomSchema>
export type ChatMessage = z.infer<typeof chatMessageSchema>
export type GetMessages = z.infer<typeof getMessagesSchema>
