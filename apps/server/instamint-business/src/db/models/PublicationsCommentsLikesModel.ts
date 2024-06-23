import BaseModel from "@/db/models/BaseModel"

class PublicationsCommentsLikesModel extends BaseModel {
  static tableName = "publications_comments_likes"

  id!: number
  userId!: number
  publicationId!: number
  commentId!: number

  count!: string
}

export default PublicationsCommentsLikesModel
