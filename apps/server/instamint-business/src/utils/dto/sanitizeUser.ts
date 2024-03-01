import { User } from "@/utils/validators/user.validator"
import UserModel from "@/db/models/UserModel"

export const sanitizeUser = (user: User): Omit<User, "password"> => {
  const { email, firstname, lastname, roleId }: User = user

  return { email, firstname, lastname, roleId }
}

export const sanitizeUsers = (
  users: UserModel[],
): Pick<UserModel, "email" | "firstname" | "lastname" | "roleData">[] => {
  return users.map((user: UserModel) => {
    const { email, firstname, lastname, roleData }: UserModel = user

    return { email, firstname, lastname, roleData }
  })
}
