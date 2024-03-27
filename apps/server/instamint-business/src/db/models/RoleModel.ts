import BaseModel from "./BaseModel"

class RoleModel extends BaseModel {
  static tableName = "roles"
  right!: string
}

export default RoleModel
