import type { Publication } from "@instamint/shared-types"
import { Dialog } from "@instamint/ui-kit"
import React from "react"

import PublicationModalContent from "./PublicationModalContent"
import ProfilePublicationCardOverlay from "../profile/ProfilePublicationCardOverlay"

type Props = {
  publication: Publication
}

const PublicationModal = (props: Props) => {
  const { publication } = props

  return (
    <Dialog>
      <ProfilePublicationCardOverlay />

      <PublicationModalContent publication={publication} />
    </Dialog>
  )
}

export default PublicationModal
