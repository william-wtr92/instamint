import type { QueryBuilder, QueryBuilderType } from "objection"

import CommentsModel from "./CommentsModel"

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
  isLiked!: boolean

  likes!: {
    id: number
    username: string
  }[]

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
      likes: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: UserModel,
        join: {
          from: "publications.id",
          through: {
            from: "publication_likes.publicationId",
            to: "publication_likes.userId",
          },
          to: "users.id",
        },
        modify: (query: QueryBuilder<UserModel>) =>
          query.select("id", "username"),
      },
      comments: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: CommentsModel,
        join: {
          from: "publications.id",
          through: {
            from: "publications_comments_relation.publicationId",
            to: "publications_comments_relation.commentId",
          },
          to: "comments.id",
        },
        modify: (query: QueryBuilder<CommentsModel>) =>
          query
            .select("comments.id", "content", "createdAt")
            .orderBy("createdAt", "desc")
            .withGraphJoined("user"),
      },
    }
  }
}

export default PublicationsModel
