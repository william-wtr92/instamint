import { z } from "zod"

export const addPublicationSchema = z.object({
  description: z.string().min(1).max(200),
  image: z.instanceof(File),
  hashtags: z.array(z.string()).max(5),
  location: z.string().optional(),
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
  comments: z.array(
    z.object({
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
  ),
  isLiked: z.boolean(),
})

export type AddPublication = z.infer<typeof addPublicationSchema>
export type GetPublications = z.infer<typeof getPublicationsSchema>
export type Publication = z.infer<typeof publicationSchema>
