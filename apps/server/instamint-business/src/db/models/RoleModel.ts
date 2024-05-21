import BaseModel from "./BaseModel"

class RoleModel extends BaseModel {
  static tableName = "roles"

  id!: number
  right!: string
}

export default RoleModel
