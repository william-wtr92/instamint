import type { QueryBuilderType } from "objection"

import BaseModel from "@/db/models/BaseModel"
import UserModel from "@/db/models/UserModel"

class PublicationsModel extends BaseModel {
  static tableName = "publications"

  id!: number
  userId!: number
  author!: string
  description!: string
  image!: string
  location!: string | null
  hashtags!: string

  count!: string

  static modifiers = {
    paginate: (
      query: QueryBuilderType<PublicationsModel>,
      limit: number,
      page: number
    ) => {
      query.limit(limit).offset(page * limit)
    },
  }

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
