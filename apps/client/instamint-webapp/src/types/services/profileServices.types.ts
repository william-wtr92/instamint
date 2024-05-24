import type { FollowPending, Profile } from "@instamint/shared-types"

export type ProfileServices = {
  follow: [Profile, null]
  unfollow: [Profile, null]
  followRequest: [FollowPending, null]
  deleteFollowRequest: [Profile, null]
}
