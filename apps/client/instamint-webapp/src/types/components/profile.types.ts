import type {
  FollowersStatus,
  FollowPending,
  Publication,
} from "@instamint/shared-types"

import type { ProfileUser, ProfileUserFollowerRequests } from "@/types"

export type ProfileHeaderProps = {
  userEmail: string | undefined
  userPage: ProfileUser | undefined
  userFollowRequests: ProfileUserFollowerRequests[] | undefined
  handleFollow: () => void
  handleUnfollow: () => void
  handleTriggerFollowRequest: (values: FollowPending) => void
  handleDeleteFollowRequest: () => void
  handleDmUser: () => void
  publications: Publication[]
  followers: number | undefined
  followed: number | undefined
  isFollowing: FollowersStatus | undefined
  requestPending: boolean | undefined
}
