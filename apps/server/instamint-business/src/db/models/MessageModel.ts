import BaseModel from "@/db/models/BaseModel"
import RoomModel from "@/db/models/RoomModel"
import UserModel from "@/db/models/UserModel"

class MessageModel extends BaseModel {
  static tableName = "messages"

  id!: number
  roomId!: number
  userId!: number
  content!: string
  createdAt!: Date
  updatedAt!: Date
  roomData!: RoomModel
  userData!: UserModel

  count!: string

  static relationMappings() {
    return {
      roomData: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: RoomModel,
        join: {
          from: "messages.roomId",
          to: "rooms.id",
        },
      },
      userData: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "messages.userId",
          to: "users.id",
        },
      },
    }
  }
}

export default MessageModel
