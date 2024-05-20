import BaseModel from "./BaseModel"
import membersRolesModel from "./MembersRoleModel"

class MembersModel extends BaseModel {
  static tableName = "members"

  id!: number
  teaBagsId!: number
  userId!: number
  membersRolesId!: number
  createdAt!: Date
  updatedAt!: Date
  membersRoleData!: membersRolesModel

  static relationMappings() {
    return {
      membersRoleData: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: membersRolesModel,
        filter: (query: any) => query.select("right"),
        join: {
          from: "members.membersRolesId",
          to: "membersRoles.id",
        },
      },
    }
  }
}

export default MembersModel
