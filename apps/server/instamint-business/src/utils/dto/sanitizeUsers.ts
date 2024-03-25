import { BaseSignUpTypes } from "@instamint/shared-types"
import UserModel from "@/db/models/UserModel"

export const sanitizeUser = (
  user: BaseSignUpTypes
): Omit<BaseSignUpTypes, "password" | "rgpdValidation"> => {
  const { username, email }: BaseSignUpTypes = user

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
