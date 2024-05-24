import type { FollowersStatus } from "@instamint/shared-types"

import BaseModel from "@/db/models/BaseModel"
import UserModel from "@/db/models/UserModel"

class FollowersModel extends BaseModel {
  static tableName = "followers"

  id!: number
  status!: FollowersStatus
  followerId!: number
  followedId!: number

  count!: string

  static relationMappings() {
    return {
      followerData: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "followers.followerId",
          to: "users.id",
        },
        modify: "selectFollowerData",
      },
      followedData: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "followers.followedId",
          to: "users.id",
        },
      },
    }
  }
}

export default FollowersModel
