import BaseModel from "./BaseModel"
import RoleModel from "./RoleModel"
import { hashPassword } from "@/utils/hashPassword"

class UserModel extends BaseModel {
  static tableName: string = "user"

  id!: number
  passwordSalt!: string
  passwordHash!: string
  email!: string
  createdAt!: Date
  updatedAt!: Date
  firstname!: string
  lastname!: string
  roleId!: number
  roleData!: RoleModel

  static relationMappings() {
    return {
      roleData: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: RoleModel,
        filter: (query: any) => query.select("right"),
        join: {
          from: "user.roleId",
          to: "role.id",
        },
      },
    }
  }

  checkPassword = async (password: string) => {
    const [passwordHash] = await hashPassword(password, this.passwordSalt)

    return passwordHash === this.passwordHash
  }
}

export default UserModel
