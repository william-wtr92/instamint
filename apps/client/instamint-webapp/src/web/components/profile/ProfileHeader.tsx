import { EnvelopeIcon } from "@heroicons/react/24/outline"
import { Avatar, AvatarFallback, AvatarImage, Text } from "@instamint/ui-kit"
import Link from "next/link"
import { useTranslation } from "react-i18next"

import type { Publication } from "@/types"
import { config } from "@/web/config"
import { routes } from "@/web/routes"
import {
  pluralCheckArray,
  pluralCheckNumber,
} from "@/web/utils/helpers/pluralCheckHelper"
import {
  firstLetter,
  firstLetterUppercase,
} from "@/web/utils/helpers/stringHelper"

type ProfileUser = {
  email: string
  username: string
  avatar: string | null
  bio: string | null
}

type ProfileHeaderProps = {
  userEmail: string | undefined
  userPage: ProfileUser | undefined
  handleDmUser: () => void
  publications: Publication[]
  followers: number | undefined
  followed: number | undefined
}

export const ProfileHeader = ({
  userEmail,
  userPage,
  handleDmUser,
  publications,
  followers,
  followed,
}: ProfileHeaderProps) => {
  const { t } = useTranslation("profile")

  const userAvatar = userPage?.avatar
    ? `${config.api.blobUrl}${userPage?.avatar}`
    : null
  const userUsername = firstLetterUppercase(userPage?.username)
  const usernameFirstLetter = firstLetter(userPage?.username)

  return (
    <div className="border-1 ml-4 mt-4 flex w-[95%] flex-row justify-start gap-2.5 rounded-md border-dashed p-4 xl:w-[95%]">
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
          {userEmail === userPage?.email && (
            <Link
              href={routes.client.profile.settings.edit}
              className="bg-accent-200 flex flex-row items-center justify-between rounded-lg p-1"
            >
              <Text type="medium" variant="neutral" className="font-normal">
                {t("profile:settings.accountInformation")}
              </Text>
            </Link>
          )}
        </div>
        <ProfileStats
          publications={publications}
          followers={followers}
          followed={followed}
          t={t}
        />
        <Text variant="neutral" type="body" className="pt-3">
          {userPage?.bio}
        </Text>
        {userEmail !== userPage?.email && (
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
  followers: number | undefined
  followed: number | undefined
  t: (key: string) => string
}

const ProfileStats = ({
  publications,
  followers,
  followed,
  t,
}: ProfileStatsProps) => {
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
