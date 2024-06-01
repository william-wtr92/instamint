import type { FollowersStatus, Publication } from "@instamint/shared-types"

export type ProfileUser = {
  email: string
  username: string
  avatar: string | null
  bio: string | null
  private: boolean
}

export type ProfileUserResult = {
  result: {
    id: number
    email: string
    username: string
    bio: string | null
    avatar: string | null
    private: boolean
    publicationData: Publication[]
  }
  followers: number
  followed: number
  isFollowing: FollowersStatus
  requestPending: boolean
}

export type ProfileUserFollowerRequests = {
  id: number
  status: FollowersStatus
  followerId: number
  followedId: number
  followerData: ProfileUser
}

export type ProfileUserFollowerRequestsResult = {
  result: ProfileUserFollowerRequests[]
}
