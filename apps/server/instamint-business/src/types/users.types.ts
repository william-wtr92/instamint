import type UserModel from "@/db/models/UserModel"

export type InsertedUser = {
  username: string
  email: string
  passwordHash: string
  passwordSalt: string
  gdprValidation: boolean
}

export type AdditionalUserFields = Omit<UserModel, "username" | "email">
