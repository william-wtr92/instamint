import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline"
import type { Publication } from "@instamint/shared-types"
import { DialogTrigger, Text } from "@instamint/ui-kit"
import Link from "next/link"
import { useTranslation } from "next-i18next"
import React, { useCallback } from "react"

import LikeButton from "@/web/components/publications/LikeButton"
import PublicationModal from "@/web/components/publications/PublicationModal"
import useAppContext from "@/web/contexts/useAppContext"
import { useGetFeedPublications } from "@/web/hooks/publications/useGetFeedPublications"
import { routes } from "@/web/routes"

type Props = {
  publication: Publication
}

const FeedPublicationCardActions = (props: Props) => {
  const { publication } = props
  const { t } = useTranslation("common")

  const username = publication?.author

  const firstThreeLikesUsernames = publication.likes
    .slice(0, 3)
    .map((like) => like.username)

  const likesCountMinusFirstUsers =
    publication.likes.length - firstThreeLikesUsernames.length

  const { handlePublicationId } = useAppContext()

  const { mutate: refreshFeedPublications } = useGetFeedPublications()

  const handleOnModalChange = useCallback(async () => {
    await refreshFeedPublications()
  }, [refreshFeedPublications])

  return (
    <div className="rounded-b-sm">
      <div className="flex flex-row items-start justify-start gap-2 border-b border-neutral-100 p-1">
        <LikeButton
          publicationId={publication.id}
          isLiked={publication.isLiked}
        />

        <PublicationModal handleOnModalChange={handleOnModalChange}>
          <DialogTrigger
            asChild
            onClick={() => handlePublicationId(publication.id)}
            className="cursor-pointer"
          >
            <ChatBubbleOvalLeftIcon
              title={t("publication-modal:icons.comment-title")}
              className="size-8 stroke-black stroke-1 text-white"
            />
          </DialogTrigger>
        </PublicationModal>
      </div>

      <div className="flex w-full flex-col gap-4 p-2">
        <Text type="medium" variant="none">
          {publication.likes.length > 0 ? (
            <span>
              {t("publications.liked-by", {
                users: firstThreeLikesUsernames.join(", "),
              })}
            </span>
          ) : (
            <span>{t("publications.no-likes")}</span>
          )}

          {likesCountMinusFirstUsers > 0 && (
            <span>
              {t("publications.and-others-likes", {
                othersUsersCount: likesCountMinusFirstUsers,
              })}
            </span>
          )}
        </Text>

        <Text type="medium" variant="none" className="text-pretty break-words">
          <Link
            href={routes.client.profile.getProfile(username)}
            className="float-left mr-1.5 font-bold"
          >
            {username}
          </Link>

          <span className="font-normal">{publication.description}</span>
        </Text>

        <div className="flex flex-col gap-1.5">
          <div className="flex flex-row gap-1">
            {JSON.parse(publication.hashtags).map((hashtag: string) => (
              <Text
                key={hashtag}
                type="small"
                variant="none"
                className="text-neutral-300"
              >
                {hashtag}
              </Text>
            ))}
          </div>

          <PublicationModal handleOnModalChange={handleOnModalChange}>
            <DialogTrigger
              asChild
              onClick={() => handlePublicationId(publication.id)}
              className="cursor-pointer"
            >
              <Text type="medium" variant="none" className="font-normal">
                {t("publications.view-comments", {
                  commentsCount: publication.comments.length,
                })}
              </Text>
            </DialogTrigger>
          </PublicationModal>
        </div>
      </div>
    </div>
  )
}

export default FeedPublicationCardActions
