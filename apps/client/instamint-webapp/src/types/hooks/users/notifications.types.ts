import type { NotificationTypes } from "@instamint/shared-types"

import type { ProfileUser } from "@/types"

export type Notification = {
  id: number
  type: NotificationTypes
  read: boolean
  createdAt: string
  updatedAt: string
  notifierUserData: ProfileUser
}
