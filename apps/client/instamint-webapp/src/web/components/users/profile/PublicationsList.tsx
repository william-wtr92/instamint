import { LockClosedIcon } from "@heroicons/react/24/solid"
import type { Publication } from "@instamint/shared-types"
import { Text } from "@instamint/ui-kit"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import ProfilePublicationCard from "./ProfilePublicationCard"
import type { ProfileUser } from "@/types"

type PublicationsListProps = {
  publications: Publication[]
  userLoggedEmail: string | undefined
  userTargeted: ProfileUser | undefined
  isFollowing: "accepted" | "pending" | "rejected" | undefined
}

export const PublicationsList = (props: PublicationsListProps) => {
  const { publications, userLoggedEmail, userTargeted, isFollowing } = props

  const { t } = useTranslation("profile")

  const renderPublicationsList = useMemo(() => {
    if (
      !userTargeted?.private ||
      userLoggedEmail === userTargeted?.email ||
      isFollowing === "accepted"
    ) {
      if (publications.length > 0) {
        return (
          <div className="flex h-fit w-full flex-row flex-wrap gap-1">
            {publications.map((publication) => (
              <ProfilePublicationCard
                key={publication.id}
                publication={publication}
              />
            ))}
          </div>
        )
      }

      return (
        <Text
          variant="neutral"
          type="body"
          className="flex h-full items-center justify-center"
        >
          {t("no-publication")}
        </Text>
      )
    }

    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 rounded-sm border border-dashed">
        <LockClosedIcon className="size-8" />
        <Text type={"body"} variant={"none"} className="text-center">
          {t("private-publications")}
        </Text>
      </div>
    )
  }, [
    isFollowing,
    publications,
    t,
    userLoggedEmail,
    userTargeted?.email,
    userTargeted?.private,
  ])

  return <>{renderPublicationsList}</>
}
