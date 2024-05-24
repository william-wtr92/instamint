import {
  ArrowLeftStartOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Text,
} from "@instamint/ui-kit"
import Link from "next/link"
import { useTranslation } from "next-i18next"
import React, { useCallback, useState } from "react"

import { AlertPopup } from "./AlertPopup"
import { ChangeLanguage } from "./ChangeLanguage"
import { config } from "@/web/config"
import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useUser } from "@/web/hooks/auth/useUser"
import { routes } from "@/web/routes"
import {
  firstLetter,
  firstLetterUppercase,
} from "@/web/utils/helpers/stringHelper"

const UserInfo = () => {
  const { t } = useTranslation("navbar")
  const {
    services: {
      auth: { signOut },
    },
  } = useAppContext()
  const { redirect } = useActionsContext()

  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const { data, isLoading } = useUser()
  const user = isLoading ? null : data
  const usernameFirstLetter = firstLetter(user?.username)
  const userUsername = firstLetterUppercase(user?.username)
  const userAvatar = user?.avatar ? `${config.api.blobUrl}${user.avatar}` : null

  const handleTriggerModal = useCallback(() => {
    setModalOpen((prev) => !prev)
  }, [])

  const handleSignOut = useCallback(async () => {
    await signOut(null)

    redirect(routes.client.signIn, 3000)
  }, [signOut, redirect])

  return (
    <>
      {user && (
        <div className="mt-3 flex flex-col items-center justify-center xl:mt-6">
          <div className="flex w-full gap-3 xl:w-[80%] xl:flex-col xl:gap-0">
            <div className="flex w-full flex-row items-center justify-between gap-4 xl:gap-7">
              <Link
                href={
                  user.link
                    ? routes.client.profile.getProfile(user.link)
                    : routes.client.profile.getProfile(user.username)
                }
              >
                <Avatar className="relative left-4 size-8 rounded-3xl outline-dotted outline-2 outline-offset-2 outline-neutral-400 xl:left-1.5 xl:size-12">
                  {userAvatar ? (
                    <AvatarImage src={userAvatar} alt={user.username} />
                  ) : (
                    <AvatarFallback>{usernameFirstLetter}</AvatarFallback>
                  )}
                </Avatar>
              </Link>
              <div className="text-small xl:text-medium flex flex-col font-semibold">
                <Text
                  type={"medium"}
                  variant={"none"}
                  className="font-extrabold"
                >
                  {userUsername}
                </Text>
                <Text
                  type={"medium"}
                  variant={"none"}
                  className="w-36 truncate xl:w-full"
                >
                  {user.email}
                </Text>
              </div>
              <Link href={routes.client.profile.settings.base}>
                <Cog6ToothIcon className="text-accent-500 w-6" />
              </Link>
            </div>
            <Button
              onClick={handleTriggerModal}
              className="text-small bg-accent-500 xl:text-medium mr-2 w-1/6 rounded-md p-0 font-semibold text-white xl:mr-0 xl:mt-4 xl:w-full xl:p-2"
            >
              <span className="text-small xl:text-medium hidden xl:block">
                {t("cta.button-sign-out")}
              </span>

              <ArrowLeftStartOnRectangleIcon className="block size-5 xl:hidden" />
            </Button>
          </div>

          <div className="mt-5 hidden xl:flex xl:w-2/3  xl:justify-center">
            <ChangeLanguage />
          </div>
        </div>
      )}

      {modalOpen && (
        <AlertPopup
          open={modalOpen}
          onClose={handleTriggerModal}
          onConfirm={handleSignOut}
          titleKey={"navbar:cta.label-sign-out"}
          descriptionKey={"navbar:cta.description-sign-out"}
          cancelKey={"navbar:cta.cancel-sign-out"}
          confirmKey={"navbar:cta.confirm-sign-out"}
        />
      )}
    </>
  )
}

export default UserInfo
