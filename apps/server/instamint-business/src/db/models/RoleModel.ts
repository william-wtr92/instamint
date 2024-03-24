import BaseModel from "./BaseModel"

class RoleModel extends BaseModel {
  static tableName: string = "roles"
  right!: string
}

export default RoleModel
