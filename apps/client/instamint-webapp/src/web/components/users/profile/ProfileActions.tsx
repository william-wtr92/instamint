import {
  CheckIcon,
  ClockIcon,
  EnvelopeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import {
  Avatar,
  AvatarFallback,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Text,
} from "@instamint/ui-kit"
import Link from "next/link"
import { useTranslation } from "next-i18next"
import { useCallback, useEffect, useMemo, useState } from "react"

import type { ProfileHeaderProps, ProfileUserFollowerRequests } from "@/types"
import { routes } from "@/web/routes"
import { firstLetter } from "@/web/utils/helpers/stringHelper"

type ProfileActionsProps = Omit<
  ProfileHeaderProps,
  "publications" | "publicationsCount" | "followers" | "followed"
>

export const ProfileActions = ({
  userEmail,
  userPage,
  userFollowRequests,
  handleFollow,
  handleUnfollow,
  handleTriggerFollowRequest,
  handleDeleteFollowRequest,
  handleDmUser,
  isFollowing,
  requestPending,
}: ProfileActionsProps) => {
  const { t } = useTranslation("profile")

  const [filteredRequests, setFilteredRequests] = useState<
    ProfileUserFollowerRequests[] | undefined
  >(userFollowRequests)

  const countFollowRequests = useMemo(() => {
    const MAX_REQUESTS_SHOWED = 99
    let count = ""

    if (
      userFollowRequests &&
      userFollowRequests?.length > MAX_REQUESTS_SHOWED
    ) {
      count = `${MAX_REQUESTS_SHOWED}+`

      return `${count}`
    }

    return `${userFollowRequests?.length}`
  }, [userFollowRequests])

  const renderActions = useMemo(() => {
    if (userEmail !== userPage?.email) {
      if (isFollowing === "accepted") {
        return (
          <div className="flex items-center gap-10">
            <Button
              className="px-5 py-1 hover:scale-105 hover:cursor-pointer"
              onClick={handleUnfollow}
            >
              <Text type={"medium"} variant={"none"}>
                {t("profile:actions.unfollow")}
              </Text>
            </Button>

            <EnvelopeIcon
              className="size-6 hover:scale-105 hover:cursor-pointer"
              onClick={handleDmUser}
            />
          </div>
        )
      } else if (isFollowing === "pending") {
        return (
          <div className="flex items-center gap-3">
            <Text
              type={"medium"}
              variant={"none"}
              className="flex items-center rounded-md px-0.5 py-1.5 text-neutral-800"
            >
              <ClockIcon className="mr-2 size-5" />
              <span className="text-medium">
                {t("profile:actions.pending")}
              </span>
            </Text>

            <Button
              className="px-2 py-1 hover:scale-105 hover:cursor-pointer"
              onClick={handleDeleteFollowRequest}
            >
              <XMarkIcon className="size-6" />
            </Button>
          </div>
        )
      }

      return (
        <div className="flex items-center gap-10">
          <Button
            className="px-5 py-1 hover:scale-105 hover:cursor-pointer"
            onClick={handleFollow}
          >
            <Text type={"medium"} variant={"none"}>
              {t("profile:actions.follow")}
            </Text>
          </Button>
        </div>
      )
    }
  }, [
    handleDmUser,
    userEmail,
    userPage,
    isFollowing,
    handleUnfollow,
    handleDeleteFollowRequest,
    handleFollow,
    t,
  ])

  const handleFilterFollowRequests = useCallback(
    (value: string) => {
      const filtered = userFollowRequests?.filter((request) => {
        return request.followerData.username
          .toLowerCase()
          .includes(value.toLowerCase())
      })

      setFilteredRequests(filtered)
    },
    [userFollowRequests]
  )

  useEffect(() => {
    setFilteredRequests(userFollowRequests)
  }, [userFollowRequests])

  return (
    <>
      <div className="flex items-center justify-between">
        {renderActions}
        {requestPending && userPage && (
          <div className="flex flex-col gap-3 xl:flex-row">
            <Button
              className="flex items-center gap-1 px-5 py-1 hover:cursor-pointer"
              onClick={() =>
                handleTriggerFollowRequest({
                  username: userPage.username,
                  accepted: false,
                })
              }
            >
              <Text type={"medium"} variant={"none"}>
                {t("profile:actions.delete-request")}
              </Text>
              <XMarkIcon className="size-5" />
            </Button>

            <Button
              className="flex items-center gap-1 px-5 py-1 hover:cursor-pointer"
              onClick={() =>
                handleTriggerFollowRequest({
                  username: userPage.username,
                  accepted: true,
                })
              }
            >
              <Text type={"medium"} variant={"none"}>
                {t("profile:actions.accept-request")}
              </Text>
              <CheckIcon className="size-5" />
            </Button>
          </div>
        )}
      </div>
      <div>
        {userPage?.email === userEmail && userPage?.private && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="text-small xl:text-medium relative py-1 xl:py-2"
              >
                <span>{t("profile:requests.title")}</span>
                <span className="text-small bg-accent-300 xl:text-medium absolute -right-2.5 -top-2.5 rounded-3xl px-1.5 py-0 xl:-right-3.5 xl:px-2 xl:py-0.5">
                  {countFollowRequests}
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="flex h-[60vh] w-[90vw] flex-col bg-white xl:w-[40vw]">
              <DialogHeader className="flex-shrink-0 gap-2 p-4">
                <DialogTitle>{t("profile:requests.title")}</DialogTitle>
                <Input
                  placeholder={t("profile:requests.placeholder")}
                  onChange={(e) => handleFilterFollowRequests(e.target.value)}
                />
              </DialogHeader>
              <div className="flex-grow overflow-y-auto p-4">
                {filteredRequests?.length === 0 ? (
                  <div className="flex items-center justify-center p-4">
                    <Text type="body" variant="neutral">
                      {t("profile:requests.no-requests")}
                    </Text>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRequests?.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between"
                      >
                        <Link
                          href={routes.client.profile.getProfile(
                            request.followerData.username
                          )}
                          className="flex cursor-pointer items-center gap-3"
                        >
                          <Avatar className="size-6 rounded-3xl outline-dotted outline-2 outline-offset-2 outline-neutral-400 xl:size-12">
                            <AvatarFallback>
                              {firstLetter(request.followerData.username)}
                            </AvatarFallback>
                          </Avatar>
                          <Text
                            type="medium"
                            variant="neutral"
                            className="text-medium w-32 truncate xl:w-full"
                          >
                            {request.followerData.username}
                          </Text>
                        </Link>
                        <div className="flex items-center gap-3">
                          <Button
                            className="cursor-pointer px-3 py-1 hover:scale-105 xl:px-5"
                            onClick={() =>
                              handleTriggerFollowRequest({
                                username: request.followerData.username,
                                accepted: false,
                              })
                            }
                          >
                            <XMarkIcon className="size-4 xl:size-5" />
                          </Button>
                          <Button
                            className="cursor-pointer px-3 py-1 hover:scale-105 xl:px-5"
                            onClick={() =>
                              handleTriggerFollowRequest({
                                username: request.followerData.username,
                                accepted: true,
                              })
                            }
                          >
                            <CheckIcon className="size-4 xl:size-5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  )
}
