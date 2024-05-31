export type User = {
  id: string
  email: string
  username: string
  createdAt: string
  roleData: string
  active: boolean
  deletionDate: string | null
}

export type Pagination = {
  limit: number
  page: number
  totalUsers: number
  totalPages: number
}

export type UsersResult = {
  result: {
    users: User[]
    pagination: Pagination
  }
}

/* Table Actions */

const userActions = {
  deactivate: "deactivate",
  reactivate: "reactivate",
  delete: "delete",
} as const

export type UserActions = (typeof userActions)[keyof typeof userActions]
