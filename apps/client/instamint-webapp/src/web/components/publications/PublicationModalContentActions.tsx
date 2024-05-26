import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline"
import { HeartIcon } from "@heroicons/react/24/solid"
import type { Publication } from "@instamint/shared-types"
import { Input, Text } from "@instamint/ui-kit"
import { useRouter } from "next/router"
import React from "react"
import { useTranslation } from "react-i18next"

import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { dateIntoString, formatDate } from "@/web/utils/helpers/dateHelper"

type Props = {
  publication: Publication
}

const PublicationModalContentActions = (props: Props) => {
  const { publication } = props

  const { t } = useTranslation("profile")
  const { locale } = useRouter()

  const {
    services: {
      users: { likePublicationService },
    },
  } = useAppContext()

  const { toast } = useActionsContext()

  const likePublication = async () => {
    const [error] = await likePublicationService({
      publicationId: publication.id.toString(),
    })

    if (error) {
      toast({
        variant: "error",
        description: error.message,
      })
    }
  }

  return (
    <div className="border-t-1 flex w-full flex-1 flex-col gap-2 border-neutral-300 p-2">
      <div className="flex flex-row items-start justify-start gap-2">
        <HeartIcon
          title={t("publication-modal.icons.like-title")}
          className="itera size-8"
          onClick={likePublication}
        />

        <ChatBubbleOvalLeftIcon
          title={t("publication-modal.icons.comment-title")}
          className="size-8"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-1 p-1">
        <Text type="medium" variant="none">
          68248 {t("publication-modal.likes")}
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
