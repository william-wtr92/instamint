import { Dialog } from "@instamint/ui-kit"
import React, { type ReactNode } from "react"

import PublicationModalContent from "@/web/components/publications/PublicationModalContent"
import useAppContext from "@/web/contexts/useAppContext"
import { useGetPublicationById } from "@/web/hooks/publications/useGetPublicationById"

type Props = {
  children: ReactNode
  handleOnModalChange: () => void
}

const PublicationModal = (props: Props) => {
  const { children, handleOnModalChange } = props

  const { publicationId } = useAppContext()

  const { data: publicationData, isLoading: publicationIsLoading } =
    useGetPublicationById(publicationId)
  const publication =
    publicationIsLoading && publicationData ? undefined : publicationData

  return (
    <Dialog onOpenChange={handleOnModalChange}>
      {children}

      {publication && <PublicationModalContent publication={publication} />}
    </Dialog>
  )
}

export default PublicationModal
