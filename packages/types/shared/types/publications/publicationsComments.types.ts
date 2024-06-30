import { z } from "zod"

export const addCommentParamSchema = z.object({
  publicationId: z.string(),
})

export const addCommentSchema = z.object({
  content: z.string(),
})

export const deleteCommentParamSchema = z.object({
  publicationId: z.string(),
  commentId: z.string(),
})

export const replyCommentParamSchema = z.object({
  publicationId: z.string(),
  commentId: z.string(),
})

export const likeCommentParamSchema = z.object({
  publicationId: z.string(),
  commentId: z.string(),
})

export const replyCommentSchema = z.object({
  content: z.string().min(1, "Comment must have at least 1 character"),
})

export const subCommentSchema = z.object({
  id: z.number(),
  content: z.string(),
  userId: z.number(),
  createdAt: z.string(),
  parentId: z.number().nullable(),
  user: z.object({
    id: z.number(),
    avatar: z.string(),
    username: z.string(),
  }),
  likes: z.array(
    z.object({
      id: z.number(),
      username: z.string(),
    })
  ),
})

export const commentSchema = z.object({
  id: z.number(),
  content: z.string(),
  userId: z.number(),
  createdAt: z.string(),
  parentId: z.number().nullable(),
  replies: z.array(subCommentSchema),
  user: z.object({
    id: z.number(),
    avatar: z.string(),
    username: z.string(),
  }),
  likes: z.array(
    z.object({
      id: z.number(),
      username: z.string(),
    })
  ),
})

export type AddCommentParam = z.infer<typeof addCommentParamSchema>
export type DeleteCommentParam = z.infer<typeof deleteCommentParamSchema>
export type ReplyCommentParam = z.infer<typeof replyCommentParamSchema>
export type LikeCommentParam = z.infer<typeof likeCommentParamSchema>
export type AddComment = z.infer<typeof addCommentSchema>
export type ReplyComment = z.infer<typeof replyCommentSchema>
export type Comment = z.infer<typeof commentSchema>
export type SubComment = z.infer<typeof subCommentSchema>
