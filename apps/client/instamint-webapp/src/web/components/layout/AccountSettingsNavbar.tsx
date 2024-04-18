import { Text } from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import Link from "next/link"
import React from "react"
import { ChevronRightIcon } from "@heroicons/react/24/outline"

const buttons = [
  {
    path: "/profile/settings/edit",
    label: "accountInformation",
  },
  {
    path: "/profile/settings/security",
    label: "security",
  },
  {
    path: "/profile/settings/notifications",
    label: "notifications",
  },
  {
    path: "/about",
    label: "about",
  },
]

const AccountSettingsNavbar = () => {
  const { t } = useTranslation(["navbar", "profile-settings"])

  return (
    <div className="xs:w-[40%] xs:border-r xs:border-neutral-200 flex h-full w-full flex-col gap-8 p-8 pt-8 lg:w-[25%]">
      <Text type="title" variant="accent" className="text-[1.6rem]">
        {t("profile-settings:title")}
      </Text>

      <div className="flex flex-col gap-4">
        {buttons.map((button, index) => (
          <Link
            key={index}
            href={button.path}
            className={`flex flex-row justify-between pb-4 ${index !== buttons.length - 1 ? "border-b border-neutral-200" : ""}`}
          >
            <Text type="body" variant="neutral" className="font-normal">
              {t(button.label)}
            </Text>

            <ChevronRightIcon className="size-6 text-neutral-200" />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default AccountSettingsNavbar
