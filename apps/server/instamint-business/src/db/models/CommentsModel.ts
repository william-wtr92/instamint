import type { Comment } from "@instamint/shared-types"
import type { QueryBuilder } from "objection"

import BaseModel from "./BaseModel"
import UserModel from "./UserModel"

import type { CommentUser } from "@/types"

class CommentsModel extends BaseModel {
  static tableName = "comments"

  id!: number
  content!: string
  userId!: number
  parentId!: number | null

  user!: CommentUser
  replies!: Comment[]

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
      replies: {
        relation: BaseModel.HasManyRelation,
        modelClass: CommentsModel,
        join: {
          from: "comments.id",
          to: "comments.parentId",
        },
        modify: (query: QueryBuilder<CommentsModel>) =>
          query
            .select("comments.id", "content", "createdAt", "parentId")
            .orderBy("createdAt", "asc")
            .withGraphJoined("user"),
      },
    }
  }
}

export default CommentsModel
