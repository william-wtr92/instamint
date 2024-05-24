import BaseModel from "@/db/models/BaseModel"
import UserModel from "@/db/models/UserModel"

class PublicationsModel extends BaseModel {
  static tableName = "publications"

  id!: number
  userId!: number
  description!: string
  image!: string

  count!: string

  static relationMappings() {
    return {
      publicationData: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "followers.followerId",
          to: "users.id",
        },
      },
    }
  }
}

export default PublicationsModel
