export type ConnectedUser = {
  result: {
    id: number
    email: string
    username: string
    bio: string
    link: string
    twoFactorAuthentication: boolean
    location: string
    avatar: string
  }
}
