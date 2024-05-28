import type { QueryBuilder } from "objection"

import BaseModel from "./BaseModel"
import UserModel from "./UserModel"

import type { CommentUser } from "@/types"

class CommentsModel extends BaseModel {
  static tableName = "comments"

  id!: number
  content!: string
  userId!: number

  user!: CommentUser

  static relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "comments.userId",
          to: "users.id",
        },
        modify: (query: QueryBuilder<UserModel>) =>
          query.select("id", "username", "avatar"),
      },
    }
  }
}

export default CommentsModel
