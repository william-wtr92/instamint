import type PublicationsModel from "@/db/models/PublicationsModel"
import type RoleModel from "@/db/models/RoleModel"
import type UserModel from "@/db/models/UserModel"

export type InsertedUser = {
  username: string
  email: string
  passwordHash: string
  passwordSalt: string
  gdprValidation: boolean
}

export type User = {
  id: number
  username: string
  email: string
  bio: string
  link: string
  location: string
  avatar: string
  passwordHash: string
  passwordSalt: string
  createdAt: Date
  updatedAt: Date
  emailValidation: boolean
  gdprValidation: boolean
  active: boolean
  deactivationDate: Date | null
  deletionDate: Date | null
  roleId: number
  roleData: RoleModel
  twoFactorAuthentication: boolean
  secret: string | null
  twoFactorBackupCodes: string | null
  publicationData: PublicationsModel[]
  count: string
}

export type AdditionalUserFields = Omit<UserModel, "username" | "email">
export type CommentUser = Pick<UserModel, "id" | "avatar" | "username">
