import { EnvelopeIcon } from "@heroicons/react/24/outline"
import type { Publication } from "@instamint/shared-types"
import { Avatar, AvatarFallback, AvatarImage, Text } from "@instamint/ui-kit"
import Link from "next/link"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"

import { config } from "@/web/config"
import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useUserByUsername } from "@/web/hooks/users/useUserByUsername"
import { routes } from "@/web/routes"
import {
  pluralCheckArray,
  pluralCheckNumber,
} from "@/web/utils/helpers/pluralCheckHelper"
import {
  firstLetter,
  firstLetterUppercase,
} from "@/web/utils/helpers/stringHelper"

type ProfileHeaderProps = {
  username: string
}

export const ProfileHeader = (props: ProfileHeaderProps) => {
  const { username } = props
  const { t } = useTranslation("profile")

  const {
    socket: { joinRoom },
  } = useAppContext()

  const { redirect } = useActionsContext()

  const {
    data: currentUser,
    followers,
    followed,
  } = useUserByUsername({ username })

  const handleDmUser = useCallback(() => {
    if (!currentUser) {
      return
    }

    joinRoom(
      { userTargetedUsername: currentUser.username },
      (roomName: string) => {
        redirect(routes.client.messages(roomName), 800)
      }
    )
  }, [currentUser, joinRoom, redirect])

  const userAvatar = currentUser?.avatar
    ? `${config.api.blobUrl}${currentUser?.avatar}`
    : null
  const userUsername = firstLetterUppercase(currentUser?.username)
  const usernameFirstLetter = firstLetter(currentUser?.username)

  return (
    <div className="border-1 --xl:w-[95%] flex flex-row justify-start gap-2.5 rounded-md border-dashed p-4">
      <Avatar className="relative left-1.5 size-12 rounded-3xl outline-dotted outline-2 outline-offset-2 outline-neutral-400 xl:size-28">
        {userAvatar ? (
          <AvatarImage src={userAvatar} alt={userUsername} />
        ) : (
          <AvatarFallback>{usernameFirstLetter}</AvatarFallback>
        )}
      </Avatar>

      <div className="ml-4 flex flex-col justify-between">
        <div className="flex flex-row pt-2">
          <Text variant="neutral" type="body" className="p-1 pr-4">
            {userUsername}
          </Text>
          {username === currentUser?.username && (
            <Link
              href={routes.client.profile.settings.edit}
              className="bg-accent-200 flex flex-row items-center justify-between rounded-lg p-1"
            >
              <Text type="medium" variant="neutral" className="font-normal">
                {t("settings.accountInformation")}
              </Text>
            </Link>
          )}
        </div>

        {currentUser && followers && followed && (
          <ProfileStats
            publications={currentUser.publicationData}
            followers={followers.count}
            followed={followed.count}
          />
        )}

        <Text variant="neutral" type="body" className="pt-3">
          {currentUser?.bio}
        </Text>

        {username !== currentUser?.username && (
          <EnvelopeIcon
            className="size-6 hover:scale-105 hover:cursor-pointer"
            onClick={handleDmUser}
          />
        )}
      </div>
    </div>
  )
}

type ProfileStatsProps = {
  publications: Publication[]
  followers: number
  followed: number
}

const ProfileStats = (props: ProfileStatsProps) => {
  const { publications, followers, followed } = props
  const { t } = useTranslation("profile")

  const numberPublications = pluralCheckArray(publications)
    ? `${publications.length} ${t("publications")}s`
    : `${publications.length} ${t("publications")}`

  const numberFollowers = pluralCheckNumber(followers)
    ? `${followers} ${t("followers")}s`
    : `${followers} ${t("followers")}`

  const numberFollowed = pluralCheckNumber(followed)
    ? `${followed} ${t("followed")}s`
    : `${followed} ${t("followed")}`

  return (
    <div className="P-1 flex flex-row pt-2">
      <Text variant="neutral" type="body" className="pr-4">
        {numberPublications}
      </Text>
      <Text variant="neutral" type="body" className="pr-4">
        {numberFollowers}
      </Text>
      <Text variant="neutral" type="body" className="pr-4">
        {numberFollowed}
      </Text>
    </div>
  )
}
