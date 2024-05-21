import { ChevronRightIcon } from "@heroicons/react/24/outline"
import { Text } from "@instamint/ui-kit"
import Link from "next/link"
import { useRouter } from "next/router"
import { useTranslation } from "next-i18next"
import React, { useCallback } from "react"

import { routes } from "@/web/routes"

const buttons = [
  {
    path: routes.client.profile.settings.edit,
    label: "accountInformation",
  },
  {
    path: routes.client.profile.settings.security,
    label: "security",
  },
  {
    path: routes.client.profile.settings.notifications,
    label: "notifications",
  },
  {
    path: routes.client.about,
    label: "about",
  },
]

const AccountSettingsNavbar = () => {
  const { t } = useTranslation("navbar")
  const router = useRouter()

  const hideNavbarStyle = useCallback(() => {
    const currentPath = router.pathname

    const routesNavbarHasToBeHiddenOnMobile = [
      routes.client.profile.settings.edit,
      routes.client.profile.settings.security,
      routes.client.profile.settings.notifications,
    ]

    return routesNavbarHasToBeHiddenOnMobile.includes(currentPath)
      ? "hidden"
      : "flex"
  }, [router])

  return (
    <div
      className={`xs:w-[40%] xs:border-r xs:border-neutral-200 xs:flex z-20 h-full w-full flex-col gap-8 bg-neutral-100 p-8 pt-8 lg:w-[25%] ${hideNavbarStyle()}`}
    >
      <Text type="title" variant="accent" className="text-[1.6rem]">
        {t("settingsNavbarTitle")}
      </Text>

      <div className="flex flex-col gap-4">
        {buttons.map((button, index) => (
          <Link
            key={index}
            href={button.path}
            className="flex flex-row items-center justify-between pb-4 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-neutral-300"
          >
            <Text type="body" variant="neutral" className="font-normal">
              {t(button.label)}
            </Text>

            <ChevronRightIcon className="size-6 text-neutral-400" />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default AccountSettingsNavbar
