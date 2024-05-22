import type { Publication as UserPublication } from "../publications/publications.types"

export type ProfileUser = {
  result: {
    email: string
    username: string
    bio: string | null
    avatar: string | null
    publicationData: UserPublication[]
  }
  followers: {
    count: number
  }
  followed: {
    count: number
  }
}
