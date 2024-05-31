import type { Publication } from "@instamint/shared-types"
import { Text } from "@instamint/ui-kit"
import { useTranslation } from "react-i18next"

import ProfilePublicationCard from "./ProfilePublicationCard"

type PublicationsListProps = {
  publications: Publication[]
}

export const PublicationsList = (props: PublicationsListProps) => {
  const { publications } = props

  const { t } = useTranslation("profile")

  return (
    <div className="flex h-fit w-full flex-row flex-wrap gap-1">
      {publications.length > 0 ? (
        publications.map((publication) => (
          <ProfilePublicationCard
            key={publication.id}
            publication={publication}
          />
        ))
      ) : (
        <Text variant="neutral" type="body" className="">
          {t("no-publication")}
        </Text>
      )}
    </div>
  )
}
