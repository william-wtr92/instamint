/* Generic  */

export const userNotFound = {
  errorCode: "userNotFound",
  message: "User not found.",
} as const

export const teaBagsNotExist = {
  errorCode: "teaBagsNotExist",
  message: "You doesn't exist.",
} as const

/* Create TeaBags */

export const nameAlreadyExist = {
  errorCode: "nameAlreadyExist",
  message: "TeaBags name already exist.",
} as const

export const linkAlreadyExist = {
  errorCode: "linkAlreadyExist",
  message: "TeaBags link is already use.",
} as const

export const errorDuringTeabagsCreation = {
  errorCode: "errorDuringTeabagsCreation",
  message: "Error during the TeaBags creation.",
} as const

export const teaBagsCreated = {
  message: "TeaBags created.",
} as const
