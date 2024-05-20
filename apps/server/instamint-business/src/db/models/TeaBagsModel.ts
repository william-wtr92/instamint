import BaseModel from "./BaseModel"

class TeaBagsModel extends BaseModel {
  static tableName = "teaBags"

  id!: number
  name!: string
  bio!: string
  link!: string
  cookNumber!: number
  owner!: number
  delete!: boolean
  createdAt!: Date
  updatedAt!: Date
}

export default TeaBagsModel
