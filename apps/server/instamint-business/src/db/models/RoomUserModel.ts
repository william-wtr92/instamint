import BaseModel from "./BaseModel"

import RoomModel from "@/db/models/RoomModel"
import UserModel from "@/db/models/UserModel"

class RoomUserModel extends BaseModel {
  static tableName = "room_users"

  id!: number
  roomId!: number
  userId!: number
  createdAt!: Date
  updatedAt!: Date
  roomData!: RoomModel
  userData!: UserModel

  static relationMappings() {
    return {
      roomData: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: RoomModel,
        join: {
          from: "room_users.roomId",
          to: "rooms.id",
        },
      },
      userData: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "room_users.userId",
          to: "users.id",
        },
      },
    }
  }
}

export default RoomUserModel
