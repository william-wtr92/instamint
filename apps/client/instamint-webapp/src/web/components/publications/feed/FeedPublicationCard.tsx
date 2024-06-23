import type { Publication } from "@instamint/shared-types"
import Image from "next/image"
import React from "react"

import FeedPublicationCardActions from "@/web/components/publications/feed/FeedPublicationCardActions"
import FeedPublicationCardHeader from "@/web/components/publications/feed/FeedPublicationCardHeader"
import { config } from "@/web/config"

type Props = {
  publication: Publication
}

const FeedPublicationCard = (props: Props) => {
  const { publication } = props

  return (
    <div
      key={publication?.id}
      className="flex w-[95%] flex-col shadow-[0px_2px_5px_0px_rgba(0,0,0,0.25)] lg:w-[60%]"
    >
      <FeedPublicationCardHeader publication={publication} />

      <div className="relative aspect-square h-fit w-full overflow-hidden">
        <Image
          src={config.api.blobUrl + publication?.image}
          alt={`Publication ${publication?.id}`}
          fill
          className="size-full object-contain"
          sizes={"100%"}
          priority={true}
        />
      </div>

      <FeedPublicationCardActions publication={publication} />
    </div>
  )
}

export default FeedPublicationCard
