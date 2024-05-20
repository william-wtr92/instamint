import BaseModel from "./BaseModel"

class membersRolesModel extends BaseModel {
  static tableName = "membersRoles"

  right!: string
}

export default membersRolesModel
