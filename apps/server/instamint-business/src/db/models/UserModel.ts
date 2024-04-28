import BaseModel from "./BaseModel"
import RoleModel from "./RoleModel"
import { hashPassword } from "@/utils/helpers/hashPassword"

class UserModel extends BaseModel {
  static tableName = "users"

  id!: number
  username!: string
  email!: string
  bio!: string
  link!: string
  location!: string
  passwordHash!: string
  passwordSalt!: string
  createdAt!: Date
  updatedAt!: Date
  emailValidation!: boolean
  gdprValidation!: boolean
  active!: boolean
  deactivationDate!: Date
  deletionDate!: Date
  roleId!: number
  roleData!: RoleModel
  twoFactorAuthentication!: boolean
  secret!: string | null
  twoFactorBackupCodes!: string[] | null

  static relationMappings() {
    return {
      roleData: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: RoleModel,
        filter: (query: any) => query.select("right"),
        join: {
          from: "users.roleId",
          to: "roles.id",
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
