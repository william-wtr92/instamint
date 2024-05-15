import BaseModel from "./BaseModel"

class RoomModel extends BaseModel {
  static tableName = "rooms"

  id!: number
  name!: string
  createdAt!: Date
  updatedAt!: Date
}

export default RoomModel
