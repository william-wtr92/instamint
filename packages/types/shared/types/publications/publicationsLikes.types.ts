import { z } from "zod"

export const publicationsLikesParamSchema = z.object({
  publicationId: z.string(),
})

export type PublicationsLikes = z.infer<typeof publicationsLikesParamSchema>
