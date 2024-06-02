import { Text } from "@instamint/ui-kit"

import type { ProfileHeaderProps } from "@/types"
import { pluralCheckNumber } from "@/web/utils/helpers/pluralCheckHelper"

type ProfileStatsProps = Pick<
  ProfileHeaderProps,
  "publicationsCount" | "followers" | "followed"
> & {
  t: (key: string) => string
}

export const ProfileStats = ({
  publicationsCount,
  followers,
  followed,
  t,
}: ProfileStatsProps) => {
  const numberPublications =
    publicationsCount > 1 ? (
      <div className="flex flex-col">
        <span className="text-center">{publicationsCount}</span>
        <span className="text-small xl:text-medium">{t("publications")}</span>
      </div>
    ) : (
      <div className="flex flex-col">
        <span className="text-center">{publicationsCount}</span>
        <span className="text-small xl:text-medium">{t("publications")}</span>
      </div>
    )
  const numberFollowers = pluralCheckNumber(followers) ? (
    <div className="flex flex-col">
      <span className="text-center">{followers}</span>
      <span className="text-small xl:text-medium">{`${t("followers")}s`}</span>
    </div>
  ) : (
    <div className="flex flex-col">
      <span className="text-center">{followers}</span>
      <span className="text-small xl:text-medium">{`${t("followers")}`}</span>
    </div>
  )
  const numberFollowed = pluralCheckNumber(followed) ? (
    <div className="flex flex-col">
      <span className="text-center">{followed}</span>
      <span className="text-small xl:text-medium">{`${t("followed")}s`}</span>
    </div>
  ) : (
    <div className="flex flex-col">
      <span className="text-center">{followed}</span>
      <span className="text-small xl:text-medium">{`${t("followed")}`}</span>
    </div>
  )

  return (
    <div className="flex flex-row gap-5 pt-5 xl:gap-10">
      <Text variant="neutral" type="body" className="text-medium xl:text-body">
        {numberPublications}
      </Text>
      <Text variant="neutral" type="body" className="text-medium xl:text-body">
        {numberFollowers}
      </Text>
      <Text variant="neutral" type="body" className="text-medium xl:text-body">
        {numberFollowed}
      </Text>
    </div>
  )
}
