import {
  HomeIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/outline"
import { Text } from "@instamint/ui-kit"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "next-i18next"
import React from "react"

const buttons = [
  {
    icon: (
      <HomeIcon className="text-accent-500 xs:size-7 size-6 stroke-[0.125rem]" />
    ),
    path: "/",
    label: "home",
  },
  {
    icon: (
      <MagnifyingGlassIcon className="text-accent-500 xs:size-7 size-6 stroke-[0.125rem]" />
    ),
    path: "/",
    label: "search",
  },
  {
    icon: (
      <UserIcon className="text-accent-500 xs:size-7 size-6 stroke-[0.125rem]" />
    ),
    path: "/profile/settings",
    label: "profile",
  },
  {
    icon: (
      <HomeIcon className="text-accent-500 xs:size-7 size-6 stroke-[0.125rem]" />
    ),
    path: "/",
    label: "home",
  },
  {
    icon: (
      <HomeIcon className="text-accent-500 xs:size-7 size-6 stroke-[0.125rem]" />
    ),
    path: "/",
    label: "home",
  },
]

const Navbar = () => {
  const { t } = useTranslation("navbar")

  return (
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
            className="xs:w-full xs:h-fit xs:items-center xs:flex md:hover:bg-accent-200 xs:rounded-md flex h-full w-1/5 items-center justify-center duration-200 md:justify-start md:gap-4 md:p-4"
          >
            {button.icon}
            <Text type="body" variant="accent" className="hidden md:block">
              {t(button.label)}
            </Text>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Navbar
