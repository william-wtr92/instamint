import type { GetServerSideProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { useCallback, useState } from "react"
import { Avatar, AvatarFallback, Button } from "@instamint/ui-kit"

import { useUser } from "@/web/hooks/auth/useUser"
import useAppContext from "@/web/contexts/useAppContext"
import useActionsContext from "@/web/contexts/useActionsContext"
import { useDelayedRedirect } from "@/web/hooks/customs/useDelayedRedirect"
import { ChangeLanguage } from "@/web/components/utils/ChangeLanguage"
import { TranslateAlertDialog } from "@/web/components/utils/TranslateAlertDialog"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common", "navbar"])),
    },
  }
}

const Home = () => {
  const {
    services: {
      auth: { signOut },
    },
  } = useAppContext()

  const { setTriggerRedirect, setRedirectLink, setRedirectDelay } =
    useActionsContext()

  const { t } = useTranslation(["common", "navbar"])

  useDelayedRedirect()

  const { data, error, isLoading } = useUser()
  const user = isLoading ? null : data
  const usernameFirstLetter = user?.username.charAt(0).toUpperCase()

  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const handleSignOut = useCallback(async () => {
    await signOut(null)

    setRedirectDelay(1000)
    setRedirectLink("/sign-in")
    setTriggerRedirect(true)
  }, [signOut, setTriggerRedirect, setRedirectLink, setRedirectDelay])

  return (
    <>
      <main className="relative flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold xl:text-6xl">{t("title")}</h1>
        <div className="xl:absolute xl:right-10 xl:top-10 xl:hover:cursor-pointer">
          {user && (
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
          )}
          <div className="mt-5 flex justify-center">
            <ChangeLanguage />
          </div>
          {isLoading && <p>Loading...</p>}
          {error && <p>Error !</p>}
        </div>
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
      </main>
    </>
  )
}
Home.title = "Instamint"

export default Home
