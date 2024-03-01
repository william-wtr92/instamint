import BaseModel from "./BaseModel"

class RoleModel extends BaseModel {
  static tableName: string = "role"
  right!: string
}

export default RoleModel
