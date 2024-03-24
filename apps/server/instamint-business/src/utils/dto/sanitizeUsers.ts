import { User } from "@/utils/validators/users.validator"
import UserModel from "@/db/models/UserModel"

export const sanitizeUser = (
  user: User
): Omit<User, "password" | "rgpdValidation"> => {
  const { username, email }: User = user

  return { username, email }
}

export const sanitizeUsers = (
  users: UserModel[]
): Pick<UserModel, "username" | "email" | "roleData">[] => {
  return users.map((user: UserModel) => {
    const { username, email, roleData }: UserModel = user

    return { username, email, roleData }
  })
}
