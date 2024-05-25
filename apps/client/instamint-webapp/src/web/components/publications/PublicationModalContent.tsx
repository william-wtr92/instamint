import type { Publication } from "@instamint/shared-types"
import { DialogContent } from "@instamint/ui-kit"
import Image from "next/image"
import React from "react"

import PublicationCommentRow from "@/web/components/publications/PublicationCommentRow"
import PublicationModalContentActions from "@/web/components/publications/PublicationModalContentActions"
import PublicationModalContentHeader from "@/web/components/publications/PublicationModalContentHeader"
import { config } from "@/web/config"
import { useUserByUsername } from "@/web/hooks/users/useUserByUsername"
import { firstLetter } from "@/web/utils/helpers/stringHelper"

type Props = {
  publication: Publication
}

const PublicationModalContent = (props: Props) => {
  const { publication } = props

  const username = publication.author

  const { data, isLoading } = useUserByUsername({
    username,
  })
  const user = isLoading ? null : data
  const usernameFirstLetter = firstLetter(username)
  const userAvatar = user?.avatar ? `${config.api.blobUrl}${user.avatar}` : null

  return (
    <DialogContent
      variant="fit"
      className="flex h-[90vh] w-[90vw] flex-row justify-start gap-0 overflow-hidden border-0 bg-neutral-100 p-0"
    >
      <div className="relative aspect-square h-full">
        <Image
          src={config.api.blobUrl + publication.image}
          alt={"Publication " + publication.id}
          fill
          className="size-full object-contain"
        />
      </div>

      <div className="border-l-1 flex h-full w-full flex-col border-neutral-300">
        <PublicationModalContentHeader
          username={username}
          userAvatar={userAvatar}
          usernameFirstLetter={usernameFirstLetter}
          location={publication.location}
        />

        <div className="h-[70%] w-full overflow-scroll">
          <PublicationCommentRow
            avatar={userAvatar}
            username={username}
            content={publication.description}
          />
        </div>

        <PublicationModalContentActions publication={publication} />
      </div>
    </DialogContent>
  )
}

export default PublicationModalContent
