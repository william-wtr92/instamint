import { z } from "zod"

export const UploadPublicationSchema = z.object({
  description: z.string().optional(),
  image: z.instanceof(File).optional(),
})

export const getPublicationSchema = z.object({
  limit: z.string().default("6"),
  offset: z.string().default("0"),
})

export type UploadPublication = z.infer<typeof UploadPublicationSchema>
export type ImagePublication = Pick<UploadPublication, "image">
export type GetPublications = z.infer<typeof getPublicationSchema>
