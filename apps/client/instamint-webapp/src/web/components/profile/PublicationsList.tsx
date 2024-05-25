import type { Publication } from "@instamint/shared-types"
import { Text } from "@instamint/ui-kit"
import { useTranslation } from "react-i18next"

import ProfilePublicationCard from "./ProfilePublicationCard"

type PublicationsListProps = {
  publications: Publication[]
  isLoading: boolean
}

export const PublicationsList = (props: PublicationsListProps) => {
  const { publications, isLoading } = props

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
        <Text variant="neutral" type="body" className="pt-3">
          {t("no-publication")}
        </Text>
      )}

      {isLoading && <p>{t("loading")}</p>}
    </div>
  )
}
