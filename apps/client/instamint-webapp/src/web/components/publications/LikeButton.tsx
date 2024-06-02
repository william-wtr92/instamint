import { HeartIcon } from "@heroicons/react/24/solid"
import { useTranslation } from "next-i18next"
import React, { useCallback } from "react"

import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useGetFeedPublications } from "@/web/hooks/publications/useGetFeedPublications"
import { useGetPublicationById } from "@/web/hooks/publications/useGetPublicationById"

type Props = {
  publicationId: number
  isLiked: boolean
}

const LikeButton = (props: Props) => {
  const { publicationId, isLiked } = props
  const { t } = useTranslation("profile")

  const {
    services: {
      users: { likePublicationService },
    },
  } = useAppContext()

  const { mutate: refreshPublication } = useGetPublicationById(publicationId)
  const { mutate: refreshPublications } = useGetFeedPublications()

  const { toast } = useActionsContext()

  const handleLikePublication = useCallback(async () => {
    if (!publicationId) {
      return
    }

    const [error] = await likePublicationService({
      publicationId: publicationId.toString(),
    })

    if (error) {
      toast({
        variant: "error",
        description: t(`errors.publications.${error.message}`),
      })
    }

    await refreshPublication()
    await refreshPublications()
  }, [
    likePublicationService,
    publicationId,
    refreshPublication,
    refreshPublications,
    t,
    toast,
  ])

  return (
    <HeartIcon
      title={t("publication-modal.icons.like-title")}
      className={`size-8 ${isLiked ? "animate-jump stroke-red-500 text-red-500" : "stroke-black text-white"} stroke-1 duration-200`}
      onClick={handleLikePublication}
    />
  )
}

export default LikeButton
