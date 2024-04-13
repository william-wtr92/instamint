import { useUser } from "@/web/hooks/auth/useUser"
import { Avatar, AvatarFallback, Button } from "@instamint/ui-kit"
import React, { useCallback, useState } from "react"
import { ChangeLanguage } from "./ChangeLanguage"
import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useTranslation } from "next-i18next"
import { AlertPopup } from "./AlertPopup"

const UserInfo = () => {
  const { t } = useTranslation(["navbar", "common"])
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

    redirect("/sign-in", 3000)
  }, [signOut, redirect])

  return (
    <>
      {user && (
        <>
          <div className="flex flex-col  items-center justify-center  rounded-md p-3 outline-dashed outline-2 outline-offset-2 outline-neutral-400">
            <div className="flex items-center gap-7">
              <Avatar className="size-4 rounded-2xl p-4 outline-dotted outline-2 outline-offset-2 outline-neutral-400">
                <AvatarFallback>{usernameFirstLetter}</AvatarFallback>
              </Avatar>
              <div className="text-medium flex flex-col font-semibold ">
                <span>{user.username}</span>
                <span className="truncate">{user.email}</span>
              </div>
            </div>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-accent-500 mt-4 w-full rounded-md p-2 font-semibold text-white"
            >
              {t("common:cta.button-sign-out")}
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
          titleKey={"common:cta.label-sign-out"}
          descriptionKey={"common:cta.description-sign-out"}
          cancelKey={"common:cta.cancel-sign-out"}
          confirmKey={"common:cta.confirm-sign-out"}
        />
      )}
    </>
  )
}

export default UserInfo
