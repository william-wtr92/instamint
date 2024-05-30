import type { Publication } from "@instamint/shared-types"
import Image from "next/image"
import React from "react"

import PublicationModal from "@/web/components/publications/PublicationModal"
import { config } from "@/web/config"

type Props = {
  publication: Publication
}

const ProfilePublicationCard = (props: Props) => {
  const { publication } = props

  return (
    <div
      key={publication?.id}
      className="group/publication relative aspect-square h-fit w-[calc((100%/3)-2.7px)] cursor-pointer overflow-hidden rounded-sm"
    >
      <Image
        src={config.api.blobUrl + publication?.image}
        alt="Publication"
        fill
        className="size-full object-contain"
      />

      <PublicationModal publication={publication} />
    </div>
  )
}

export default ProfilePublicationCard
