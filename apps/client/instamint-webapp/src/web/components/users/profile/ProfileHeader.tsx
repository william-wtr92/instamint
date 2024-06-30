import { LockClosedIcon, UserIcon } from "@heroicons/react/24/outline"
import { Avatar, AvatarFallback, AvatarImage, Text } from "@instamint/ui-kit"
import Link from "next/link"
import { useTranslation } from "next-i18next"

import type { ProfileHeaderProps } from "@/types"
import { ProfileActions } from "@/web/components/users/profile/ProfileActions"
import { ProfileStats } from "@/web/components/users/profile/ProfileStats"
import { config } from "@/web/config"
import { routes } from "@/web/routes"
import {
  firstLetter,
  firstLetterUppercase,
} from "@/web/utils/helpers/stringHelper"

export const ProfileHeader = ({
  userEmail,
  userPage,
  userFollowRequests,
  handleFollow,
  handleUnfollow,
  handleTriggerFollowRequest,
  handleDeleteFollowRequest,
  handleDmUser,
  publicationsCount,
  followers,
  followed,
  isFollowing,
  requestPending,
}: ProfileHeaderProps) => {
  const { t } = useTranslation("profile")

  const userAvatar = userPage?.avatar
    ? `${config.api.blobUrl}${userPage?.avatar}`
    : null
  const userUsername = firstLetterUppercase(userPage?.username)
  const usernameFirstLetter = firstLetter(userPage?.username)

  return (
    <div className="border-1 flex flex-row justify-start gap-2.5 rounded-md border-dashed p-2 lg:items-center">
      <Avatar className="relative mt-3 size-12 rounded-xl outline-dotted outline-2 outline-offset-2 outline-neutral-400 xl:mt-0 xl:size-28">
        {userAvatar ? (
          <AvatarImage src={userAvatar} alt={userUsername} />
        ) : (
          <AvatarFallback>{usernameFirstLetter}</AvatarFallback>
        )}
      </Avatar>
      <div className="ml-4 flex flex-col justify-between xl:w-full">
        <div className="flex flex-row gap-1 pt-2 xl:gap-5">
          <div className="flex items-center gap-1">
            <Text
              variant="neutral"
              type="body"
              className="text-body xl:text-subheading relative -left-1 p-1 sm:pr-4"
            >
              {userUsername}
            </Text>
            {userPage?.private && <LockClosedIcon className="size-6" />}
          </div>
          {userEmail === userPage?.email && (
            <Link
              href={routes.client.profile.settings.edit}
              className="bg-accent-200 flex flex-row items-center justify-between rounded-lg p-1"
            >
              <Text
                type="medium"
                variant="neutral"
                className="text-small xl:text-body hidden text-center font-normal sm:px-2 xl:block"
              >
                {t("profile:settings.accountInformation")}
              </Text>
              <UserIcon className="block size-6 xl:hidden" />
            </Link>
          )}
        </div>

        <ProfileStats
          publicationsCount={publicationsCount}
          followers={followers}
          followed={followed}
          t={t}
        />

        <Text variant="neutral" type="body" className="pt-3">
          {userPage?.bio}
        </Text>

        <ProfileActions
          userEmail={userEmail}
          userPage={userPage}
          userFollowRequests={userFollowRequests}
          handleFollow={handleFollow}
          handleUnfollow={handleUnfollow}
          handleTriggerFollowRequest={handleTriggerFollowRequest}
          handleDeleteFollowRequest={handleDeleteFollowRequest}
          handleDmUser={handleDmUser}
          isFollowing={isFollowing}
          requestPending={requestPending}
        />
      </div>
    </div>
  )
}
