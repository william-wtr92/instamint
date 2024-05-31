import type { NotificationTypes } from "@instamint/shared-types"

import BaseModel from "@/db/models/BaseModel"
import UserModel from "@/db/models/UserModel"

class NotificationModel extends BaseModel {
  static tableName = "notifications"

  id!: number
  type!: NotificationTypes
  read!: boolean
  createdAt!: Date
  updatedAt!: Date
  notifiedUserId!: number
  notifierUserId!: number
  notifierUserData!: UserModel

  count!: string

  static relationMappings() {
    return {
      notifiedUserData: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "notifications.notifiedUserId",
          to: "users.id",
        },
        modify: "selectSanitizedUser",
      },
      notifierUserData: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "notifications.notifierUserId",
          to: "users.id",
        },
        modify: "selectSanitizedUser",
      },
    }
  }
}

export default NotificationModel
