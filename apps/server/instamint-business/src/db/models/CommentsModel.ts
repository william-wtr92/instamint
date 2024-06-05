import type { Comment } from "@instamint/shared-types"
import type { QueryBuilder } from "objection"

import BaseModel from "@/db/models/BaseModel"
import UserModel from "@/db/models/UserModel"
import type { CommentUser } from "@/types"

class CommentsModel extends BaseModel {
  static tableName = "comments"

  id!: number
  content!: string
  userId!: number
  parentId!: number | null

  user!: CommentUser
  replies!: Comment[]
  likes!: {
    id: number
    username: string
  }[]
  createdAt!: string
  updatedAt!: string

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
            .withGraphJoined("user")
            .withGraphFetched("likes"),
      },
      likes: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: UserModel,
        join: {
          from: "comments.id",
          through: {
            from: "publications_comments_likes.commentId",
            to: "publications_comments_likes.userId",
          },
          to: "users.id",
        },
        modify: (query: QueryBuilder<UserModel>) =>
          query.select("users.id", "username"),
      },
    }
  }
}

export default CommentsModel
