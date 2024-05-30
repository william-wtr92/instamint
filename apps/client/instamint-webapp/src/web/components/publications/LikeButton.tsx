import { HeartIcon } from "@heroicons/react/24/solid"
import { useTranslation } from "next-i18next"
import React from "react"

import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useGetPublicationById } from "@/web/hooks/publications/useGetPublicationById"

type Props = {
  isLiked: boolean
}

const LikeButton = (props: Props) => {
  const { isLiked } = props
  const { t } = useTranslation("profile")

  const {
    services: {
      users: { likePublicationService },
    },
    publicationId,
  } = useAppContext()

  const { mutate } = useGetPublicationById(publicationId)

  const { toast } = useActionsContext()

  const likePublication = async () => {
    if (!publicationId) {
      return
    }

    const [error] = await likePublicationService({
      publicationId: publicationId.toString(),
    })

    if (error) {
      toast({
        variant: "error",
        description: error.message,
      })
    }

    await mutate()
  }

  return (
    <HeartIcon
      title={t("publication-modal.icons.like-title")}
      className={`size-8 ${isLiked ? "animate-jump stroke-red-500 text-red-500" : "stroke-black text-neutral-100"} stroke-1 duration-200`}
      onClick={likePublication}
    />
  )
}

export default LikeButton
