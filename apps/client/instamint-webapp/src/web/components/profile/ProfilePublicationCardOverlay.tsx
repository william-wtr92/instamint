import { ChatBubbleOvalLeftIcon, HeartIcon } from "@heroicons/react/24/outline"
import { DialogTrigger } from "@instamint/ui-kit"
import { t } from "i18next"
import React from "react"

const ProfilePublicationCardOverlay = () => {
  return (
    <DialogTrigger asChild>
      <div className="absolute left-0 top-0 flex size-full flex-col items-center justify-center gap-2 bg-black p-2 text-white opacity-0 duration-300 group-hover/publication:opacity-50">
        <div className="flex flex-row items-center gap-2">
          <p>239</p>
          <HeartIcon
            title={t("publication-modal.icons.like-title")}
            className="size-8"
          />
        </div>

        <div className="flex flex-row items-center gap-2">
          <p>9982</p>
          <ChatBubbleOvalLeftIcon
            title={t("publication-modal.icons.comment-title")}
            className="size-8"
          />
        </div>
      </div>
    </DialogTrigger>
  )
}

export default ProfilePublicationCardOverlay
