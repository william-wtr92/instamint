import type { Publication } from "../publications/publications.types"

export type ProfileUser = {
  result: {
    email: string
    username: string
    bio: string | null
    avatar: string | null
    publicationData: Publication[]
  }
  followers: {
    count: number
  }
  followed: {
    count: number
  }
}
