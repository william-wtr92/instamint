import type NotificationModel from "@/db/models/NotificationModel"

export const sanitizeNotifications = (notifications: NotificationModel[]) => {
  return notifications.map((notification) => {
    const {
      id,
      type,
      read,
      createdAt,
      updatedAt,
      notifierUserData,
    }: NotificationModel = notification

    return {
      id,
      type,
      read,
      createdAt,
      updatedAt,
      notifierUserData,
    }
  })
}
