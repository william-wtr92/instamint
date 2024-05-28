import { z } from "zod"

export const addCommentParamSchema = z.object({
  publicationId: z.string(),
})

export const addCommentSchema = z.object({
  userId: z.number(),
  content: z.string(),
})

export const deleteCommentParamSchema = z.object({
  publicationId: z.string(),
  commentId: z.string(),
})

export const commentSchema = z.object({
  id: z.number(),
  content: z.string(),
  userId: z.number(),
  createdAt: z.string(),
  user: z.object({
    id: z.number(),
    avatar: z.string(),
    username: z.string(),
  }),
})

export type AddCommentParam = z.infer<typeof addCommentParamSchema>
export type AddComment = z.infer<typeof addCommentSchema>
export type DeleteCommentParam = z.infer<typeof deleteCommentParamSchema>
export type Comment = z.infer<typeof commentSchema>
