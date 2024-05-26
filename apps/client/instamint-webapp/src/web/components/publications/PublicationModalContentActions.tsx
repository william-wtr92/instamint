import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/solid"
import type { Publication } from "@instamint/shared-types"
import { Input, Text } from "@instamint/ui-kit"
import { useRouter } from "next/router"
import React from "react"
import { useTranslation } from "react-i18next"

import LikeButton from "@/web/components/publications/LikeButton"
import { dateIntoString, formatDate } from "@/web/utils/helpers/dateHelper"

type Props = {
  publication: Publication
}

const PublicationModalContentActions = (props: Props) => {
  const { publication } = props

  const { t } = useTranslation("profile")
  const { locale } = useRouter()

  return (
    <div className="border-t-1 flex w-full flex-1 flex-col gap-2 border-neutral-300 p-2">
      <div className="flex flex-row items-start justify-start gap-2">
        <LikeButton
          publicationId={publication.id}
          isLiked={publication.isLiked}
        />

        <ChatBubbleOvalLeftIcon
          title={t("publication-modal.icons.comment-title")}
          className="size-8 stroke-black stroke-1 text-neutral-100"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-1 p-1">
        <Text type="medium" variant="none">
          {publication.likes.length} {t("publication-modal.likes")}
        </Text>

        <Text type="small" variant="none">
          {dateIntoString(formatDate(publication.createdAt), locale!)}
        </Text>
      </div>

      <Input
        type="text"
        placeholder={t("publication-modal.add-comment-placeholder")}
      />
    </div>
  )
}

export default PublicationModalContentActions
