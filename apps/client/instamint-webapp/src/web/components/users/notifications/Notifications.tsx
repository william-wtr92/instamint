import { BellIcon, Cog6ToothIcon } from "@heroicons/react/24/outline"
import type {
  NotificationTypes,
  ReadNotification,
} from "@instamint/shared-types"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@instamint/ui-kit"
import Link from "next/link"
import { useTranslation } from "next-i18next"
import React, { useCallback } from "react"

import type { Notification } from "@/types"
import { config } from "@/web/config"
import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useNotification } from "@/web/hooks/users/notifications/useNotification"
import { routes } from "@/web/routes"
import { timePassed } from "@/web/utils/helpers/dateHelper"

export const Notifications = () => {
  const { t } = useTranslation("navbar")
  const {
    services: {
      users: { readNotification },
    },
  } = useAppContext()
  const { toast } = useActionsContext()

  const {
    data: notificationsData,
    isValidating,
    size,
    setSize,
    mutate,
  } = useNotification()
  const showNotifications = notificationsData?.flatMap((page) => {
    const unreadNotifications = page.result.notifications.filter(
      (notification) => !notification.read
    )

    return unreadNotifications.length > 0
  })[0]

  const notifierUserAvatar = (path: string) => {
    return `${config.api.blobUrl}${path}`
  }

  const notificationMessageByType = (type: NotificationTypes) => {
    switch (type) {
      case "follow":
        return t("notifications.follow")

      case "request":
        return t("notifications.request")

      case "like":
        return t("notifications.like")

      case "comment":
        return t("notifications.comment")

      default:
        return t("notifications.follow")
    }
  }

  const timeTerminology = (date: string) => {
    switch (timePassed(date).type) {
      case "day":
        return t("notifications.date.day")

      case "hour":
        return t("notifications.date.hour")

      case "minute":
        return t("notifications.date.minute")

      default:
        return t("notifications.date.hour")
    }
  }

  const handleReadNotification = useCallback(
    async (values: ReadNotification, notification: Notification) => {
      if (notification.read) {
        return
      }

      const [err] = await readNotification(values)

      if (err) {
        toast({
          variant: "error",
          description: t(`errors:users.notifications.${err.message}`),
        })
      }

      toast({
        variant: "success",
        description: t("notifications.success"),
      })

      await mutate()
    },
    [readNotification, toast, mutate, t]
  )

  const loadMoreNotifications = useCallback(async () => {
    if (!isValidating) {
      await setSize(size + 1)
    }
  }, [isValidating, size, setSize])

  const handleScroll = useCallback(
    async (e: React.UIEvent<HTMLDivElement>) => {
      const bottom =
        e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
        e.currentTarget.clientHeight

      if (bottom) {
        await loadMoreNotifications()
      }
    },
    [loadMoreNotifications]
  )

  return (
    <div className="flex items-center gap-3">
      <Popover>
        <PopoverTrigger className="relative">
          {showNotifications && (
            <div className="absolute">
              <span className="absolute -top-[0.100rem] left-[0.950rem] inline-flex size-2.5 animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="absolute left-4 inline-flex size-2 rounded-full bg-red-400"></span>
            </div>
          )}
          <BellIcon className="text-accent-500 relative size-6" />
        </PopoverTrigger>
        <PopoverContent
          side="left"
          className="relative left-20 top-14 flex h-80 w-72 flex-col gap-5 overflow-y-auto bg-white opacity-80 xl:left-3 xl:w-80 xl:opacity-90"
          onScroll={handleScroll}
        >
          {notificationsData &&
            notificationsData.flatMap((page) =>
              page.result.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center justify-center gap-3"
                  onClick={() =>
                    handleReadNotification(
                      {
                        notificationId: notification.id.toString(),
                      },
                      notification
                    )
                  }
                >
                  <div className="flex flex-col items-center justify-between gap-3">
                    {!notification.read && (
                      <span className="bg-accent-400 size-2 rounded-3xl xl:size-2.5 xl:rounded-2xl"></span>
                    )}
                    <Text
                      type={"medium"}
                      variant={"none"}
                      className="text-small xl:text-medium flex h-3 w-5 justify-center"
                    >
                      {timePassed(notification.createdAt).value}

                      {timeTerminology(notification.createdAt)}
                    </Text>
                  </div>

                  <Link
                    href={routes.client.profile.getProfile(
                      notification.notifierUserData.username
                    )}
                  >
                    <div className="flex gap-2 py-1.5">
                      <div className="flex items-center">
                        <Avatar className="size-6 rounded-3xl outline-dashed outline-1 outline-neutral-500 xl:size-9">
                          <AvatarImage
                            src={notifierUserAvatar(
                              notification.notifierUserData.avatar!
                            )}
                            alt={notification.notifierUserData.username}
                          />
                          <AvatarFallback>
                            {notification.notifierUserData.username[0]}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex w-full flex-col items-center gap-1.5">
                        <Text
                          type={"medium"}
                          variant={"none"}
                          className="text-medium w-20 truncate text-center xl:w-44"
                        >
                          {notification.notifierUserData.username}
                        </Text>
                        <Text
                          type={"medium"}
                          variant={"none"}
                          className="text-medium w-44 text-center  font-light"
                        >
                          {notificationMessageByType(notification.type)}
                        </Text>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
        </PopoverContent>
      </Popover>
      <Link href={routes.client.profile.settings.base}>
        <Cog6ToothIcon className="text-accent-500 size-6" />
      </Link>
    </div>
  )
}
