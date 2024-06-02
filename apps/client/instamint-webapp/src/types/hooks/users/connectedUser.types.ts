import type { FollowersStatus } from "@instamint/shared-types"

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
  followedUsers: {
    status: FollowersStatus
    followedId: number
  }[]
}

export type ConnectedUserResult = {
  result: ConnectedUser
}
