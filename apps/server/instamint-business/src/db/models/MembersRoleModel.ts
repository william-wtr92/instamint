import BaseModel from "./BaseModel"

class MembersRolesModel extends BaseModel {
  static tableName = "membersRoles"

  id!: number
  right!: string
}

export default MembersRolesModel
