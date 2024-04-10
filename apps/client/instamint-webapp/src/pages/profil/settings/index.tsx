import { useCallback, useEffect, useState } from "react"
import type { GetServerSideProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useUser } from "@/web/hooks/auth/useUser"
import Link from "next/link"
import { ChangeSettingsForm } from "@/web/components/settings/ChangeSettingsForm"
import useAppContext from "@/web/contexts/useAppContext"
import useActionsContext from "@/web/contexts/useActionsContext"
import { type UsernameEmailSettingsSchema } from "@instamint/shared-types"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "errors",
        "sign-up",
        "common",
        "settings",
      ])),
    },
  }
}

const SettingsPage = () => {
  const { data, error, isLoading } = useUser()
  const userConnect = isLoading ? null : data
  const [viewSettings, setViewSettings] = useState("username")
  const [user, setUser] = useState<UsernameEmailSettingsSchema | undefined>(
    undefined
  )
  const { t } = useTranslation(["errors", "sign-up"])
  const {
    services: {
      users: { userGetInformation, userUpdateInformation },
    },
  } = useAppContext()
  const { setTriggerRedirect, setRedirectLink, setError, setSuccess } =
    useActionsContext()

  const fetchData = useCallback(async () => {
    if (userConnect) {
      const [err, data] = await userGetInformation(userConnect)

      if (err) {
        setError(t(`errors:auth.${err.message}`))

        return
      }

      setUser(data)
    } else {
      setRedirectLink("/sign-in")
      setTriggerRedirect(true)
    }
  }, [
    userConnect,
    userGetInformation,
    setError,
    t,
    setRedirectLink,
    setTriggerRedirect,
  ])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const onSubmit = useCallback(
    async (values: UsernameEmailSettingsSchema) => {
      const [err] = await userUpdateInformation(values)

      if (err) {
        setError(t(`errors:auth.${err.message}`))
      }

      setSuccess(t("sign-up:success"))
    },
    [setError, setSuccess, userUpdateInformation, t]
  )

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="w-[95%] sm:w-[70%] xl:w-[60%] xl:h-[70%]">
        <div className="grid grid-cols-3 p-4 h-full w-full border-solid border-2 border-black shadow-xl rounded-lg">
          <div className="grid grid-rows-4 border-r-4 border-solid col-span-1">
            <div className="xl:p-5 p-3 mr-4 border-b-4 border-solid">
              <Link href="#" onClick={() => setViewSettings("username")}>
                {t("settings:libelle-username-email")}
              </Link>
            </div>
            <div className="xl:p-5 p-3 mr-4 border-b-4 border-solid">
              <Link href="#" onClick={() => setViewSettings("bio")}>
                {t("settings:libelle-bio")}
              </Link>
            </div>
            <div className="xl:p-5 p-3 mr-4 border-b-4 border-solid">
              <Link href="#" onClick={() => setViewSettings("link")}>
                {t("settings:libelle-link")}
              </Link>
            </div>
            <div className="xl:p-5 p-3">
              <Link href="#" onClick={() => setViewSettings("picture")}>
                {t("settings:libelle-picture")}
              </Link>
            </div>
          </div>
          <div className="flex items-center pr-5 justify-center col-span-2 w-full">
            <ChangeSettingsForm
              settingsRequired={viewSettings}
              translation={t}
              user={user}
              onSubmit={onSubmit}
            ></ChangeSettingsForm>
          </div>
        </div>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error !</p>}
      </div>
    </div>
  )
}

export default SettingsPage
