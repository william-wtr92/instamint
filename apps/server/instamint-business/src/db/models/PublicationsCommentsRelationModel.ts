import BaseModel from "./BaseModel"
import CommentsModel from "./CommentsModel"
import UserModel from "./UserModel"

class PublicationsCommentsRelationModel extends BaseModel {
  static tableName = "publications_comments_relation"

  id!: number
  userId!: number
  publicationId!: number
  commentId!: number

  static relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "publications_comments_relation.userId",
          to: "users.id",
        },
      },
      comment: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: CommentsModel,
        join: {
          from: "publications_comments_relation.commentId",
          to: "comments.id",
        },
      },
    }
  }
}

export default PublicationsCommentsRelationModel
