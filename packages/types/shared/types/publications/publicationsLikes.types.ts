import { z } from "zod"

export const publicationsLikesParamSchema = z.object({
  publicationId: z.string(),
})

export type PublicationsLikesParam = z.infer<
  typeof publicationsLikesParamSchema
>
