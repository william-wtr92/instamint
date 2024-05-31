import { LockClosedIcon } from "@heroicons/react/24/outline"
import type { FollowersStatus } from "@instamint/shared-types"
import { Text } from "@instamint/ui-kit"
import Image from "next/image"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import type { ProfileUser, Publication } from "@/types"
import { config } from "@/web/config"

type PublicationsGridProps = {
  publications: Publication[]
  isLoading: boolean
  havePublication: boolean
  scrollContainerRef: React.RefObject<HTMLDivElement>
  userEmail: string | undefined
  userPage: ProfileUser | undefined
  isFollowing: FollowersStatus | undefined
}

export const PublicationsGrid = ({
  userEmail,
  publications,
  isLoading,
  havePublication,
  scrollContainerRef,
  userPage,
  isFollowing,
}: PublicationsGridProps) => {
  const { t } = useTranslation("profile")

  const renderPublications = useMemo(() => {
    {
      if (
        !userPage?.private ||
        userEmail === userPage?.email ||
        isFollowing === "accepted"
      ) {
        if (havePublication) {
          return publications.map((publication) => (
            <Image
              key={publication?.id}
              src={config.api.blobUrl + publication?.image}
              alt="post"
              width={250}
              height={250}
              className="h-[250px] w-[250px]"
            />
          ))
        }

        return (
          <Text variant="neutral" type="body" className="pt-3">
            {t("profile:no-publication")}
          </Text>
        )
      }

      return (
        <div className="flex flex-col items-center">
          <LockClosedIcon className="size-8" />
          <Text type={"body"} variant={"none"} className="text-center">
            {t("profile:private-publications")}
          </Text>
        </div>
      )
    }
  }, [publications, userPage, havePublication, isFollowing, userEmail, t])

  return (
    <div
      className="p-text-large-screen border-1 scrollbar-thin scrollbar-thumb-accent-400 scrollbar-track-neutral-100 grid h-[85%] grid-cols-3 gap-1 overflow-y-auto rounded-md"
      ref={scrollContainerRef}
    >
      <div>{renderPublications}</div>
      {isLoading && <p>{t("profile:loading")}</p>}
    </div>
  )
}
