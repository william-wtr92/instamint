import {
  AdjustmentsHorizontalIcon,
  Cog6ToothIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline"
import { Avatar, AvatarFallback, AvatarImage, Text } from "@instamint/ui-kit"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "next-i18next"
import React, { useCallback, useState } from "react"

import AddPublicationModal from "@/web/components/publications/add-publication-modal/AddPublicationModal"
import { config } from "@/web/config"
import { useUser } from "@/web/hooks/auth/useUser"
import { routes } from "@/web/routes"
import { firstLetter } from "@/web/utils/helpers/stringHelper"

const buttons = [
  {
    icon: (
      <HomeIcon className="text-accent-500 xs:size-7 size-6 stroke-[0.125rem]" />
    ),
    path: routes.client.home,
    label: "home",
  },
  {
    icon: (
      <MagnifyingGlassIcon className="text-accent-500 xs:size-7 size-6 stroke-[0.125rem]" />
    ),
    path: routes.client.home,
    label: "search",
  },
  {
    icon: (
      <Cog6ToothIcon className="text-accent-500 xs:size-7 size-6 stroke-[0.125rem]" />
    ),
    path: routes.client.profile.settings.base,
    label: "settings",
  },
]

const Navbar = () => {
  const { t } = useTranslation("navbar")

  const { data, isLoading } = useUser()
  const user = isLoading ? null : data

  const [showAddPublicationModal, setShowAddPublicationModal] =
    useState<boolean>(false)

  const handleShowAddPublicationModal = useCallback(() => {
    setShowAddPublicationModal((prevState) => !prevState)
  }, [])

  return (
    <>
      <div className="xs:h-full xs:min-w-[3.125rem] xs:w-fit xs:flex xs:flex-col xs:justify-start xs:px-2 xs:pt-10 xs:shadow-[0_0.125rem_5px_0_#00000040] xs:gap-12 z-30 h-[7%] w-full bg-neutral-50 lg:w-1/5 lg:min-w-[175px]">
        <Image
          alt="Instamint logo"
          src={"/favicon.ico"}
          width={33}
          height={33}
          className="xs:block hover:animate-shake mx-auto hidden duration-300 lg:hidden"
        />

        <Text
          type="title"
          variant="transparent"
          className="xs:text-left from-accent-800 to-accent-300 hidden w-0 bg-gradient-to-br bg-clip-text lg:ml-4 lg:block lg:w-fit"
        >
          Instamint
        </Text>

        <div className="xs:flex-col xs:gap-8 xs:items-center flex h-full md:gap-4">
          {buttons.map((button, index) => (
            <Link
              key={index}
              href={button.path}
              className={`xs:w-full xs:h-fit xs:items-center xs:flex md:hover:bg-accent-200 xs:rounded-md flex h-full w-1/5 items-center justify-center duration-200 md:justify-start md:gap-4  md:p-4 order-${index + 1} md:order-none`}
            >
              {button.icon}
              <Text type="body" variant="accent" className="hidden md:block">
                {t(button.label)}
              </Text>
            </Link>
          ))}

          <button
            onClick={handleShowAddPublicationModal}
            className="xs:w-full xs:h-fit xs:items-center xs:flex md:hover:bg-accent-200 xs:rounded-md order-2 flex h-full w-1/5 items-center justify-center duration-200 md:order-last md:justify-start md:gap-4 md:p-4"
          >
            <PlusCircleIcon className="text-accent-500 xs:size-7 size-6 stroke-[0.125rem]" />

            <Text type="body" variant="accent" className="hidden md:block">
              {t("publish")}
            </Text>
          </button>

          {user && (
            <Link
              className="order-5 flex w-full flex-1 flex-row items-center justify-center md:hidden"
              href={
                user.link
                  ? routes.client.profile.getProfile(user.link)
                  : routes.client.profile.getProfile(user.username)
              }
            >
              <Avatar className="xs:hidden relative block size-7 rounded-3xl">
                {user.avatar ? (
                  <AvatarImage
                    src={config.api.blobUrl + user.avatar}
                    alt={user.username}
                  />
                ) : (
                  <AvatarFallback>{firstLetter(user.username)}</AvatarFallback>
                )}
              </Avatar>
            </Link>
          )}

          {user?.roleData === "admin" && (
            <Link
              href={routes.client.admin.users}
              className="xs:w-full xs:h-fit xs:items-center xs:flex md:hover:bg-accent-200 xs:rounded-md flex h-full w-1/5 items-center justify-center duration-200 md:justify-start md:gap-4 md:p-4"
            >
              <AdjustmentsHorizontalIcon className="text-accent-500 xs:size-7 size-6 stroke-[0.125rem]" />
              <Text type="body" variant="accent" className="hidden md:block">
                {t("admin")}
              </Text>
            </Link>
          )}
        </div>
      </div>

      {showAddPublicationModal && (
        <AddPublicationModal
          isOpen={showAddPublicationModal}
          handleShowAddPublicationModal={handleShowAddPublicationModal}
        />
      )}
    </>
  )
}

export default Navbar
