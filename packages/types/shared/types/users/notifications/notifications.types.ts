import { z } from "zod"

export const readNotificationSchema = z.object({
  notificationId: z.string(),
})
export const getNotificationsSchema = z.object({
  limit: z.string().default("20"),
  offset: z.string().default("0"),
})

export type ReadNotification = z.infer<typeof readNotificationSchema>
export type GetNotifications = z.infer<typeof getNotificationsSchema>
export type NotificationTypes = "follow" | "request" | "like" | "comment"
