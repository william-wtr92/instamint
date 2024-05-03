import { Cog6ToothIcon } from "@heroicons/react/24/outline"
import { Avatar, AvatarFallback, AvatarImage, Button } from "@instamint/ui-kit"
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
  const usernameFirstLetter = user?.username.charAt(0).toUpperCase()
  const userAvatar = user?.avatar ? `${config.api.blobUrl}${user.avatar}` : null

  const handleSignOut = useCallback(async () => {
    await signOut(null)

    redirect(routes.client.signIn, 3000)
  }, [signOut, redirect])

  return (
    <>
      {user && (
        <div className="mt-6 flex flex-col items-center justify-center">
          <div className="flex w-[80%] flex-col">
            <div className="flex w-full flex-col items-center justify-between sm:flex-row xl:gap-7">
              <Avatar className="relative left-1.5 size-12 rounded-3xl outline-dotted outline-2 outline-offset-2 outline-neutral-400">
                {userAvatar ? (
                  <AvatarImage src={userAvatar} alt={user.username} />
                ) : (
                  <AvatarFallback>{usernameFirstLetter}</AvatarFallback>
                )}
              </Avatar>
              <div className="text-medium flex flex-col font-semibold ">
                <span>{user.username}</span>
                <span className="truncate">{user.email}</span>
              </div>
              <Link href={routes.client.profile.settings.base}>
                <Cog6ToothIcon className="text-accent-500 w-6" />
              </Link>
            </div>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-accent-500 mt-4 w-full rounded-md p-2 font-semibold text-white"
            >
              {t("cta.button-sign-out")}
            </Button>
          </div>

          <div className="mt-5 flex w-2/3 justify-center">
            <ChangeLanguage />
          </div>
        </div>
      )}

      {modalOpen && (
        <AlertPopup
          open={modalOpen}
          onClose={() => setModalOpen(false)}
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
