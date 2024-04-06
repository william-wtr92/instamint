import { HomeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Button, Text } from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import Image from "next/image"
import React from "react"

const buttons = [
  {
    icon: (
      <HomeIcon className="text-accent-500 xs:w-7 xs:h-7 h-6 w-6 stroke-[0.125rem]" />
    ),
    // label: t("navbar:home"),
    label: "home",
  },
  {
    icon: (
      <MagnifyingGlassIcon className="text-accent-500 xs:w-7 xs:h-7 h-6 w-6 stroke-[0.125rem]" />
    ),
    // label: t("navbar:search"),
    label: "search",
  },
  {
    icon: (
      <HomeIcon className="text-accent-500 xs:w-7 xs:h-7 h-6 w-6 stroke-[0.125rem]" />
    ),
    // label: t("navbar:home"),
    label: "home",
  },
  {
    icon: (
      <HomeIcon className="text-accent-500 xs:w-7 xs:h-7 h-6 w-6 stroke-[0.125rem]" />
    ),
    // label: t("navbar:home"),
    label: "home",
  },
  {
    icon: (
      <HomeIcon className="text-accent-500 xs:w-7 xs:h-7 h-6 w-6 stroke-[0.125rem]" />
    ),
    label: "home",
  },
]

const Navbar = () => {
  const { t } = useTranslation(["navbar"])

  return (
    <div className="xs:h-full xs:min-w-[3.125rem] xs:w-fit xs:flex xs:flex-col xs:justify-start xs:px-2 xs:pt-10 xs:shadow-[0_0.125rem_5px_0_#00000040] xs:gap-8 w-full bg-neutral-50 lg:w-1/5 lg:min-w-[175px]">
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

      <div className="xs:flex xs:flex-col xs:gap-2 xs:mt-4 grow gap-4">
        {buttons.map((button, index) => (
          <Button
            key={index}
            className="xs:w-full xs:h-fit xs:flex xs:justify-start xs:items-center xs:gap-4 md:hover:bg-accent-200 xs:p-4 xs:rounded-md h-[100%] w-1/5 duration-200"
          >
            {button.icon}
            <Text
              type="body"
              variant="accent"
              className="hidden font-normal lg:block"
            >
              {/* {button.label} */}
              {t(`navbar:${button.label}`)}
            </Text>
          </Button>
        ))}
      </div>
    </div>
  )
}

export default Navbar
