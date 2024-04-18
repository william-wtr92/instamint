import { Avatar, AvatarFallback, Button } from "@instamint/ui-kit"
import React, { useCallback, useState } from "react"
import { useTranslation } from "next-i18next"
import { Cog6ToothIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

import { ChangeLanguage } from "./ChangeLanguage"
import { AlertPopup } from "./AlertPopup"
import { useUser } from "@/web/hooks/auth/useUser"
import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
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

  const handleSignOut = useCallback(async () => {
    await signOut(null)

    redirect(routes.client.signIn, 3000)
  }, [signOut, redirect])

  return (
    <>
      {user && (
        <>
          <div className="flex flex-col  items-center justify-center rounded-md p-3 outline-dashed outline-2 outline-offset-2 outline-neutral-400">
            <div className="flex flex-col items-center gap-3 sm:flex-row xl:gap-7">
              <Avatar className="size-4 rounded-2xl p-4 outline-dotted outline-2 outline-offset-2 outline-neutral-400">
                <AvatarFallback>{usernameFirstLetter}</AvatarFallback>
              </Avatar>
              <div className="text-medium flex flex-col font-semibold ">
                <span>{user.username}</span>
                <span className="truncate">{user.email}</span>
              </div>
              <Link href={routes.client.profile.settings}>
                <Cog6ToothIcon className="w-6" />
              </Link>
            </div>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-accent-500 mt-4 w-full rounded-md p-2 font-semibold text-white"
            >
              {t("cta.button-sign-out")}
            </Button>
          </div>

          <div className="mt-5 flex justify-center">
            <ChangeLanguage />
          </div>
        </>
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
