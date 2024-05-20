export type PublicationData = {
  id: number
  userId: number
  image: string
  description: string
}

export type ProfileUser = {
  result: {
    email: string
    username: string
    bio: string | null
    avatar: string | null
    publicationData: PublicationData[]
  }
  followers: {
    count: number
  }
  followed: {
    count: number
  }
}
