import type { Publication } from "@instamint/shared-types"
import { Text } from "@instamint/ui-kit"
import Image from "next/image"
import { useTranslation } from "react-i18next"

import { config } from "@/web/config"

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
          <div
            key={publication?.id}
            className="relative aspect-square h-fit w-[calc((100%/3)-2.7px)] overflow-hidden rounded-sm"
          >
            <Image
              src={config.api.blobUrl + publication?.image}
              alt="Publication"
              fill
              className="size-full object-contain"
            />
          </div>
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
