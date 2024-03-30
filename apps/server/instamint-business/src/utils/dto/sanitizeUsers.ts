import type { BaseSignUp } from "@instamint/shared-types"

import type UserModel from "@/db/models/UserModel"
import type { AdditionalUserFields } from "@/types"

export const sanitizeCreatedUser = (
  user: BaseSignUp
): Omit<BaseSignUp, "password" | "gdprValidation"> => {
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

export const sanitizeUser = <T extends keyof AdditionalUserFields>(
  user: UserModel,
  additionalFields: T[] = []
) => {
  const additionalData: Pick<UserModel, T> = additionalFields.reduce(
    (acc, field) => {
      acc[field] = user[field]

      return acc
    },
    {} as Pick<UserModel, T>
  )

  return { username: user.username, email: user.email, ...additionalData }
}
