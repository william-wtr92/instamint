import { z } from "zod"

export const publicationsLikesSchema = z.object({
  publicationId: z.string(),
})

export type PublicationsLikes = z.infer<typeof publicationsLikesSchema>
