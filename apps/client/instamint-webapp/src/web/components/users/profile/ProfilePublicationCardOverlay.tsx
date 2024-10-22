import { ChatBubbleOvalLeftIcon, HeartIcon } from "@heroicons/react/24/outline"
import type { Publication } from "@instamint/shared-types"
import { DialogTrigger } from "@instamint/ui-kit"
import { t } from "i18next"
import React from "react"

import useAppContext from "@/web/contexts/useAppContext"

type Props = {
  publicationInList: Publication
}

const ProfilePublicationCardOverlay = (props: Props) => {
  const { publicationInList } = props

  const { handlePublicationId } = useAppContext()

  return (
    <DialogTrigger
      asChild
      onClick={() => handlePublicationId(publicationInList.id)}
    >
      <div className="absolute left-0 top-0 flex size-full flex-col items-center justify-center gap-2 bg-black p-2 text-white opacity-0 duration-300 group-hover/publication:opacity-50">
        <div className="flex flex-row items-center gap-2">
          <p>{publicationInList.likes.length}</p>
          <HeartIcon
            title={t("publication-modal:icons.like-title")}
            className="size-8"
          />
        </div>

        <div className="flex flex-row items-center gap-2">
          <p>{publicationInList.comments.length}</p>
          <ChatBubbleOvalLeftIcon
            title={t("publication-modal:icons.comment-title")}
            className="size-8"
          />
        </div>
      </div>
    </DialogTrigger>
  )
}

export default ProfilePublicationCardOverlay
