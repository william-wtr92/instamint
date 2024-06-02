export type ConnectedUser = {
  id: number
  email: string
  username: string
  bio: string
  link: string
  twoFactorAuthentication: boolean
  location: string
  avatar: string
  roleData: string
  private: boolean
  searchByEmail: boolean
}

export type ConnectedUserResult = {
  result: ConnectedUser
}
