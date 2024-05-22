import { z } from "zod"

export const uploadPublicationSchema = z.object({
  description: z.string().optional(),
  image: z.instanceof(File).optional(),
})

export const getPublicationsSchema = z.object({
  limit: z.string().default("6"),
  offset: z.string().default("0"),
})

export type UploadPublication = z.infer<typeof uploadPublicationSchema>
export type ImagePublication = Pick<UploadPublication, "image">
export type GetPublications = z.infer<typeof getPublicationsSchema>
