import BaseModel from "@/db/models/BaseModel"
import UserModel from "@/db/models/UserModel"

class FollowersModel extends BaseModel {
  static tableName = "followers"

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
