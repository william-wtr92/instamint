import { z } from "zod"
import { commentSchema, subCommentSchema } from "./publicationsComments.types"

export const addPublicationSchema = z.object({
  description: z.string().min(1).max(200),
  image: z.instanceof(File),
  hashtags: z.array(z.string()).max(5),
  location: z.string().optional(),
})

export const getPublicationParamSchema = z.object({
  publicationId: z.string(),
})

export const getPublicationsParamSchema = z.object({
  username: z.string(),
})

export const getPublicationsSchema = z.object({
  limit: z.string().default("6"),
  offset: z.string().default("0"),
})

export const publicationSchema = z.object({
  id: z.number(),
  author: z.string(),
  description: z.string().min(1).max(200),
  image: z.string(),
  location: z.string().nullable().optional(),
  hashtags: z.string(),
  userId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  likes: z.array(z.object({ id: z.number(), username: z.string() })),
  comments: z.array(commentSchema),
  isLiked: z.boolean(),
})

export type AddPublication = z.infer<typeof addPublicationSchema>
export type GetPublicationParam = z.infer<typeof getPublicationParamSchema>
export type GetPublicationsParam = z.infer<typeof getPublicationsParamSchema>
export type GetPublications = z.infer<typeof getPublicationsSchema>
export type Publication = z.infer<typeof publicationSchema>
