import { z } from "zod"

export const addPublicationSchema = z.object({
  author: z.string().min(3).max(20),
  description: z.string().min(1).max(200),
  image: z.instanceof(File),
  hashtags: z.array(z.string()).max(5),
  location: z.string().optional(),
})

export type AddPublication = z.infer<typeof addPublicationSchema>
