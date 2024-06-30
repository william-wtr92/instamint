import type { Publication } from "@instamint/shared-types"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  Text,
  Button,
} from "@instamint/ui-kit"
import Link from "next/link"
import { useTranslation } from "next-i18next"
import React, { useCallback } from "react"

import { config } from "@/web/config"
import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useUser } from "@/web/hooks/auth/useUser"
import { routes } from "@/web/routes"
import { firstLetter } from "@/web/utils/helpers/stringHelper"

type Props = {
  publication: Publication
}

const followingStatus = {
  following: "following",
  notFollowing: "notFollowing",
  pending: "pending",
} as const

const FeedPublicationCardHeader = (props: Props) => {
  const { publication } = props
  const { t } = useTranslation("common")

  const username = publication?.author
  const userAvatar = config.api.blobUrl + publication?.user.avatar
  const usernameFirstLetter = firstLetter(username)
  const location = publication.location

  const {
    services: {
      profile: { follow, unfollow },
    },
  } = useAppContext()

  const { toast } = useActionsContext()

  const { data, isLoading, mutate: refreshUser } = useUser()
  const user = isLoading ? null : data

  const handleIsAlreadyFollowingUser = useCallback(
    (publicationAuthorId: number) => {
      if (!user) {
        return
      }

      const followingUser = user?.followedUsers.find(
        (follower) => follower.followedId === publicationAuthorId
      )

      if (!followingUser) {
        return followingStatus.notFollowing
      }

      if (followingUser.status === followingStatus.pending) {
        return followingStatus.pending
      }

      return followingStatus.following
    },
    [user]
  )

  const handleFollowUser = useCallback(
    async (username: string) => {
      const [err] = await follow({ username })

      if (err) {
        toast({
          variant: "error",
          description: t(`errors:users.profile.follow.${err.message}`),
        })

        return
      }

      await refreshUser()
      toast({
        variant: "success",
        description: t("profile:actions.messages.followSuccess", {
          username,
        }),
      })
    },
    [follow, refreshUser, t, toast]
  )

  const handleUnfollowUser = useCallback(
    async (username: string) => {
      const [err] = await unfollow({ username })

      if (err) {
        toast({
          variant: "error",
          description: t(`errors:users.profile.follow.${err.message}`),
        })

        return
      }

      await refreshUser()
      toast({
        variant: "success",
        description: t("profile:actions.messages.unfollowSuccess", {
          username,
        }),
      })
    },
    [unfollow, refreshUser, toast, t]
  )

  const displayFollowButton = (publication: Publication) => {
    if (user?.id !== publication.userId) {
      const callback = () => {
        switch (handleIsAlreadyFollowingUser(publication.userId)) {
          case followingStatus.following:
            return handleUnfollowUser(publication.author)

          case followingStatus.pending:
            return null

          case followingStatus.notFollowing:
            return handleFollowUser(publication.author)
        }
      }

      return (
        <Button className="text-accent-500 bg-white" onClick={callback}>
          {handleIsAlreadyFollowingUser(publication.userId) ===
            followingStatus.following && t("cta.unfollow")}
          {handleIsAlreadyFollowingUser(publication.userId) ===
            followingStatus.pending && t("cta.pending")}
          {handleIsAlreadyFollowingUser(publication.userId) ===
            followingStatus.notFollowing && t("cta.follow")}
        </Button>
      )
    }
  }

  return (
    <div className="flex w-full flex-row justify-between rounded-t-sm p-1.5">
      <div className="flex flex-row gap-2">
        <Link href={routes.client.profile.getProfile(username)}>
          <Avatar className="border-accent-500 size-8 border">
            {userAvatar ? (
              <AvatarImage src={userAvatar} alt={username} />
            ) : (
              <AvatarFallback>{usernameFirstLetter}</AvatarFallback>
            )}
          </Avatar>
        </Link>

        <div className="flex flex-col">
          <Link href={routes.client.profile.getProfile(username!)}>
            <Text type="medium" variant="none">
              {username}
            </Text>
          </Link>

          <Text type="small" variant="none">
            {location}
          </Text>
        </div>
      </div>

      {displayFollowButton(publication)}
    </div>
  )
}

export default FeedPublicationCardHeader
