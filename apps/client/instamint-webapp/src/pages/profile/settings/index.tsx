import { useCallback, useState } from "react"
import type { GetServerSideProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import {
  type DeleteAccount,
  type UserInfosSchema,
} from "@instamint/shared-types"

import { useUser } from "@/web/hooks/auth/useUser"
import { UpdateUserInfos } from "@/web/components/settings/UpdateUserInfos"
import useAppContext from "@/web/contexts/useAppContext"
import useActionsContext from "@/web/contexts/useActionsContext"
import { DeleteAccountForm } from "@/web/components/forms/DeleteAccount"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "errors",
        "profile-settings",
      ])),
    },
  }
}

const SettingsPage = () => {
  const { data, isLoading } = useUser()
  const user = isLoading ? null : data
  const [viewSettings, setViewSettings] = useState<string>("username-settings")

  const { t } = useTranslation(["errors", "profile-settings"])
  const {
    services: {
      users: { updateUserInfos, deleteAccount },
    },
  } = useAppContext()
  const { redirect, setError, setSuccess, error, success } = useActionsContext()

  const onSubmit = useCallback(
    async (values: UserInfosSchema) => {
      const [err] = await updateUserInfos(values)

      if (err) {
        setError(
          t(`errors:users.profile-settings.update-account.${err.message}`)
        )

        return
      }

      setSuccess(t("profile-settings:update-account.success"))
    },
    [updateUserInfos, setSuccess, t, setError]
  )

  const handleDeleteAccountSubmit = useCallback(
    async (values: DeleteAccount) => {
      const [err] = await deleteAccount(values)

      if (err) {
        setError(
          t(`errors:users.profile-settings.delete-account.${err.message}`)
        )

        return
      }

      setSuccess(t("profile-settings:delete-account.success"))
      redirect("/", 3000)
    },
    [redirect, setError, setSuccess, deleteAccount, t]
  )

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="w-[95%] sm:w-[70%] xl:w-[60%] xl:h-[70%]">
        <div className="grid grid-cols-3 p-4 h-full w-full border-solid border-2 shadow-xl rounded-lg">
          <div className="grid grid-rows-5 border-accent-200 border-r-4 border-solid col-span-1">
            <div className="p-3 mr-4 border-accent-200 border-b-4 border-solid font-semibold">
              <p onClick={() => setViewSettings("username-settings")}>
                {t("profile-settings:update-account.username.label")}
              </p>
            </div>
            <div className="xl:p-5 p-3 mr-4 border-accent-200 border-b-4 border-solid font-semibold">
              <p onClick={() => setViewSettings("bio-settings")}>
                {t("profile-settings:update-account.bio.label")}
              </p>
            </div>
            <div className="xl:p-5 p-3 mr-4 border-accent-200 border-b-4 border-solid font-semibold">
              <p onClick={() => setViewSettings("link-settings")}>
                {t("profile-settings:update-account.link.label")}
              </p>
            </div>
            <div className="xl:p-5 p-3  mr-4 border-accent-200 border-b-4 border-solid font-semibold">
              <p onClick={() => setViewSettings("picture-settings")}>
                {t("profile-settings:update-account.picture.label")}
              </p>
            </div>
            <div className="xl:p-5 p-3">
              <DeleteAccountForm
                onSubmit={handleDeleteAccountSubmit}
                success={success}
                error={error}
              />
            </div>
          </div>
          <div className="flex items-center p-5 justify-center col-span-2 w-full">
            <UpdateUserInfos
              settingsRequired={viewSettings}
              user={user}
              success={success}
              error={error}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
