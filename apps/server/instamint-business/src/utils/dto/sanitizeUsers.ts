import { BaseSignUp } from "@instamint/shared-types"
import UserModel from "@/db/models/UserModel"

export const sanitizeUser = (
  user: BaseSignUp
): Omit<BaseSignUp, "password" | "rgpdValidation"> => {
  const { username, email }: BaseSignUp = user

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
