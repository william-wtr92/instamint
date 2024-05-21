import type { BaseSignUp } from "@instamint/shared-types"

import type UserModel from "@/db/models/UserModel"
import type { AdditionalUserFields } from "@/types"

export const sanitizeCreatedUser = (
  user: BaseSignUp
): Omit<BaseSignUp, "password" | "gdprValidation"> => {
  const { username, email }: BaseSignUp = user

  return { username, email }
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

  return {
    username: user.username,
    email: user.email,
    roleData: user.roleData?.right,
    ...additionalData,
  }
}

export const sanitizeUsers = <T extends keyof AdditionalUserFields>(
  users: UserModel[],
  additionalFields: T[] = []
) => {
  return users.map((user: UserModel) => {
    return sanitizeUser(user, additionalFields)
  })
}
