import { Text } from "@instamint/ui-kit"
import Image from "next/image"
import { useTranslation } from "react-i18next"

import type { Publication } from "@/types"
import { config } from "@/web/config"

type PublicationsGridProps = {
  publications: Publication[]
  isLoading: boolean
  havePublication: boolean
  scrollContainerRef: React.RefObject<HTMLDivElement>
}

export const PublicationsGrid = ({
  publications,
  isLoading,
  havePublication,
  scrollContainerRef,
}: PublicationsGridProps) => {
  const { t } = useTranslation("profile")

  return (
    <div
      className="p-text-large-screen border-1 scrollbar-thin scrollbar-thumb-accent-400 scrollbar-track-neutral-100 grid h-[85%] grid-cols-3 gap-1 overflow-y-auto rounded-md"
      ref={scrollContainerRef}
    >
      {havePublication ? (
        publications.map((publication) => (
          <Image
            key={publication?.id}
            src={config.api.blobUrl + publication?.image}
            alt="post"
            width={250}
            height={250}
            className="h-[250px] w-[250px]"
          />
        ))
      ) : (
        <Text variant="neutral" type="body" className="pt-3">
          {t("profile:no-publication")}
        </Text>
      )}
      {isLoading && <p>{t("profile:loading")}</p>}
    </div>
  )
}
