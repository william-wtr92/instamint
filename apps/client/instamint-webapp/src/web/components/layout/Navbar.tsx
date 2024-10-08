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
import React, { useCallback, useEffect, useMemo, useState } from "react"

import AddPublicationModal from "@/web/components/publications/add-publication-modal/AddPublicationModal"
import { SearchBox } from "@/web/components/utils/SearchBox"
import { config } from "@/web/config"
import { useUser } from "@/web/hooks/auth/useUser"
import { routes } from "@/web/routes"
import { firstLetter } from "@/web/utils/helpers/stringHelper"

const Navbar = () => {
  const { t } = useTranslation("navbar")

  const { data, isLoading } = useUser()
  const user = isLoading ? null : data

  const [showAddPublicationModal, setShowAddPublicationModal] =
    useState<boolean>(false)

  const [openSearch, setOpenSearch] = useState<boolean>(false)

  const handleShowAddPublicationModal = useCallback(() => {
    setShowAddPublicationModal((prevState) => !prevState)
  }, [])

  const handleSearchClick = useCallback(() => {
    setOpenSearch((open) => !open)
  }, [])

  const buttons = useMemo(
    () => [
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
        onClick: handleSearchClick,
        label: "search.title",
      },
      {
        icon: (
          <Cog6ToothIcon className="text-accent-500 xs:size-7 size-6 stroke-[0.125rem]" />
        ),
        path: routes.client.profile.settings.base,
        label: "settings",
      },
      {
        icon: (
          <PlusCircleIcon className="text-accent-500 xs:size-7 size-6 stroke-[0.125rem]" />
        ),
        onClick: handleShowAddPublicationModal,
        label: "publish",
      },
    ],
    [handleSearchClick, handleShowAddPublicationModal]
  )

  const renderButtons = useMemo(() => {
    return buttons.map((button, index) => {
      if (button.onClick) {
        return (
          <button
            key={index}
            onClick={button.onClick}
            className={`xs:w-full xs:h-fit xs:items-center xs:flex md:hover:bg-accent-200 xs:rounded-md flex h-full w-1/5 items-center justify-center duration-200 md:justify-start md:gap-4  md:p-4 order-${index + 1} md:order-none`}
          >
            {button.icon}
            <Text type="body" variant="accent" className="hidden md:block">
              {t(button.label)}
            </Text>

            {button.label === "search.title" && (
              <p className="text-medium">
                <kbd className="text-accent-900 bg-muted pointer-events-none inline-flex hidden h-5 select-none items-center gap-1 rounded border px-1.5 font-medium opacity-100 xl:flex">
                  <span className="text-lg">⌘</span>K
                </kbd>
              </p>
            )}
          </button>
        )
      }

      return (
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
      )
    })
  }, [buttons, t])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpenSearch((open) => !open)
      }
    }

    document.addEventListener("keydown", down)

    return () => document.removeEventListener("keydown", down)
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
          {renderButtons}

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
                  <AvatarFallback className="font-semibold">
                    {firstLetter(user.username)}
                  </AvatarFallback>
                )}
              </Avatar>
            </Link>
          )}

          {user?.roleData === "admin" && (
            <Link
              href={routes.client.admin.users}
              className="xs:w-full xs:h-fit xs:items-center xs:flex md:hover:bg-accent-200 xs:rounded-md hidden h-full w-1/5 items-center justify-center duration-200 md:justify-start md:gap-4 md:p-4 lg:flex"
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

      {openSearch && <SearchBox open={openSearch} setOpen={setOpenSearch} />}
    </>
  )
}

export default Navbar
