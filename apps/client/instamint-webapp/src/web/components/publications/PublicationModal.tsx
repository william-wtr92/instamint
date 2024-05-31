import type { Publication } from "@instamint/shared-types"
import { Dialog } from "@instamint/ui-kit"
import React, { useState } from "react"

import PublicationModalContent from "@/web/components/publications/PublicationModalContent"
import ProfilePublicationCardOverlay from "@/web/components/users/profile/ProfilePublicationCardOverlay"
import useAppContext from "@/web/contexts/useAppContext"
import { useGetPublicationById } from "@/web/hooks/publications/useGetPublicationById"
import { useGetPublicationsFromUser } from "@/web/hooks/publications/useGetPublicationsFromUser"

type Props = {
  publicationInList: Publication
}

const PublicationModal = (props: Props) => {
  const { publicationInList } = props

  const { publicationId } = useAppContext()

  const { mutate } = useGetPublicationsFromUser(publicationInList.author)

  const { data: publicationData, isLoading: publicationIsLoading } =
    useGetPublicationById(publicationId)
  const publication =
    publicationIsLoading && publicationData ? undefined : publicationData

  const [showPublicationModal, setShowPublicationModal] =
    useState<boolean>(false)

  const handleShowPublicationModal = async () => {
    await mutate()
    setShowPublicationModal((prevState) => !prevState)
  }

  return (
    <Dialog
      open={showPublicationModal}
      onOpenChange={handleShowPublicationModal}
    >
      <ProfilePublicationCardOverlay publicationInList={publicationInList} />

      {publication && <PublicationModalContent publication={publication} />}
    </Dialog>
  )
}

export default PublicationModal
