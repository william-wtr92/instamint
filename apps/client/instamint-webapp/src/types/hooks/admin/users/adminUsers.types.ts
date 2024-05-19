export type User = {
  id: string
  email: string
  username: string
  createdAt: string
  roleData: string
  active: boolean
}

export type Pagination = {
  limit: number
  page: number
  totalUsers: number
  totalPages: number
}

export type Users = {
  result: {
    users: User[]
    pagination: Pagination
  }
}

/* Table Actions */

const userActions = {
  deactivate: "deactivate",
  reactivate: "reactivate",
} as const

export type UserActions = (typeof userActions)[keyof typeof userActions]
