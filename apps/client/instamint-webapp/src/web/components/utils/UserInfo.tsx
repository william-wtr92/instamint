import { useUser } from "@/web/hooks/auth/useUser"
import { Avatar, AvatarFallback, Button } from "@instamint/ui-kit"
import React, { useCallback, useState } from "react"
import { ChangeLanguage } from "./ChangeLanguage"
import { TranslateAlertDialog } from "./TranslateAlertDialog"
import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useTranslation } from "next-i18next"

const UserInfo = () => {
  const { t } = useTranslation(["navbar"])
  const {
    services: {
      auth: { signOut },
    },
  } = useAppContext()
  const { setTriggerRedirect, setRedirectLink, setRedirectDelay } =
    useActionsContext()

  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const { data, isLoading } = useUser()
  const user = isLoading ? null : data
  const usernameFirstLetter = user?.username.charAt(0).toUpperCase()

  const handleSignOut = useCallback(async () => {
    await signOut(null)

    setRedirectDelay(1000)
    setRedirectLink("/sign-in")
    setTriggerRedirect(true)
  }, [signOut, setTriggerRedirect, setRedirectLink, setRedirectDelay])

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
              {t("cta.button-sign-out")}
            </Button>
          </div>

          <div className="mt-5 flex justify-center">
            <ChangeLanguage />
          </div>
        </>
      )}

      {modalOpen && (
        <TranslateAlertDialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleSignOut}
          titleKey={"cta.label-sign-out"}
          descriptionKey={"cta.description-sign-out"}
          cancelKey={"cta.cancel-sign-out"}
          confirmKey={"cta.confirm-sign-out"}
        />
      )}
    </>
  )
}

export default UserInfo
