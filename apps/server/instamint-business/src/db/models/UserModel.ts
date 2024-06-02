import type { QueryBuilder, QueryBuilderType } from "objection"

import BaseModel from "./BaseModel"
import FollowerModel from "./FollowerModel"
import PublicationsModel from "./PublicationsModel"
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
  avatar!: string
  passwordHash!: string
  passwordSalt!: string
  createdAt!: Date
  updatedAt!: Date
  emailValidation!: boolean
  gdprValidation!: boolean
  active!: boolean
  private!: boolean
  deactivationDate!: Date | null
  deletionDate!: Date | null
  roleId!: number
  roleData!: RoleModel
  twoFactorAuthentication!: boolean
  secret!: string | null
  twoFactorBackupCodes!: string | null
  publicationData!: PublicationsModel

  followedUsers!: FollowerModel[]

  count!: string

  static modifiers = {
    selectUserData: (query: QueryBuilderType<UserModel>) => {
      query.select("id", "username")
    },

    async selectFollowerData(query: QueryBuilder<UserModel>) {
      query.select("username", "email", "avatar", "private")
    },

    async selectSanitizedUser(query: QueryBuilder<UserModel>) {
      query.select("username", "email", "avatar", "private")
    },
  }

  static relationMappings() {
    return {
      roleData: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: RoleModel,
        join: {
          from: "users.roleId",
          to: "roles.id",
        },
      },
      publicationData: {
        relation: BaseModel.HasManyRelation,
        modelClass: PublicationsModel,
        join: {
          from: "users.id",
          to: "publications.userId",
        },
      },
      followedUsers: {
        relation: BaseModel.HasManyRelation,
        modelClass: FollowerModel,
        join: {
          from: "users.id",
          to: "followers.followerId",
        },
        modify: (query: QueryBuilder<FollowerModel>) => {
          query.select("followedId", "status")
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
