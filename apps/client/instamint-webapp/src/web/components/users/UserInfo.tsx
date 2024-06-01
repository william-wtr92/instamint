import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Text,
} from "@instamint/ui-kit"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "next-i18next"
import React, { useCallback, useState } from "react"

import { AlertPopup } from "../utils/AlertPopup"
import { Notifications } from "@/web/components/users/notifications/Notifications"
import { ChangeLanguage } from "@/web/components/utils/ChangeLanguage"
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

  const { data: userData, isLoading } = useUser()
  const user = isLoading ? null : userData
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
        <div className="xs:flex-col xs:gap-4 xs:justify-start flex h-full w-full flex-row items-center justify-end gap-4 p-2 lg:p-4">
          <Image
            alt="Instamint logo"
            className="xs:hidden ml-2 mr-auto"
            src={"/favicon.ico"}
            width={28}
            height={28}
          />

          <Link
            href={
              user.link
                ? routes.client.profile.getProfile(user.link)
                : routes.client.profile.getProfile(user.username)
            }
          >
            <Avatar className="relative hidden size-8 rounded-3xl outline-dotted outline-2 outline-offset-2 outline-neutral-400 md:block xl:size-12">
              {userAvatar ? (
                <AvatarImage src={userAvatar} alt={user.username} />
              ) : (
                <AvatarFallback>{usernameFirstLetter}</AvatarFallback>
              )}
            </Avatar>
          </Link>

          <div className="xs:flex hidden flex-col items-center font-semibold">
            <Text type={"medium"} variant={"none"} className="">
              {userUsername}
            </Text>
            <Text type={"medium"} variant={"none"} className="">
              {user.email}
            </Text>
          </div>

          <Notifications />

          <Button
            onClick={handleTriggerModal}
            className="bg-accent-500 order-4 w-fit rounded-md font-semibold text-white md:mx-auto md:w-[90%]"
          >
            <span className="hidden md:block">{t("cta.button-sign-out")}</span>

            <ArrowLeftStartOnRectangleIcon className="block size-6 md:hidden" />
          </Button>

          <div className="w-fit md:mx-auto md:w-[90%]">
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
