import BaseModel from "@/db/models/BaseModel"

class PublicationsLikesModel extends BaseModel {
  static tableName = "publication_likes"

  userId!: number
  publicationId!: number

  count!: string
}

export default PublicationsLikesModel
