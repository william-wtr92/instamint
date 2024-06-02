import type { Publication } from "@instamint/shared-types"
import Image from "next/image"
import React, { useCallback } from "react"

import ProfilePublicationCardOverlay from "./ProfilePublicationCardOverlay"
import PublicationModal from "@/web/components/publications/PublicationModal"
import { config } from "@/web/config"
import { useGetPublicationsFromUser } from "@/web/hooks/publications/useGetPublicationsFromUser"

type Props = {
  publication: Publication
}

const ProfilePublicationCard = (props: Props) => {
  const { publication } = props

  const { mutate } = useGetPublicationsFromUser(publication.author)

  const handleOnModalChange = useCallback(async () => {
    await mutate()
  }, [mutate])

  return (
    <div
      key={publication?.id}
      className="group/publication relative aspect-square h-fit w-[calc((100%/2)-2.7px)] cursor-pointer overflow-hidden rounded-sm lg:w-[calc((100%/3)-2.7px)]"
    >
      <Image
        src={config.api.blobUrl + publication?.image}
        alt={`Publication ${publication?.id}`}
        fill
        className="size-full object-contain"
      />

      <PublicationModal handleOnModalChange={handleOnModalChange}>
        <ProfilePublicationCardOverlay publicationInList={publication} />
      </PublicationModal>
    </div>
  )
}

export default ProfilePublicationCard
