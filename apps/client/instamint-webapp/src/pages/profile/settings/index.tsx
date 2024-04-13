import type { GetServerSideProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { useCallback } from "react"
import { type DeleteAccount } from "@instamint/shared-types"

import { DeleteAccountForm } from "@/web/components/forms/DeleteAccount"
import useAppContext from "@/web/contexts/useAppContext"
import useActionsContext from "@/web/contexts/useActionsContext"
import { useDelayedRedirect } from "@/web/hooks/customs/useDelayedRedirect"

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
  const {
    services: {
      users: { deleteAccount },
    },
  } = useAppContext()

  const { redirect, error, setError, success, setSuccess } = useActionsContext()

  const { t } = useTranslation(["errors", "profile-settings"])

  useDelayedRedirect()

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
    <div className="flex flex-col gap-5 p-5">
      <h1 className="relative left-1">{t("profile-settings:title")}</h1>
      <div className="w-full rounded-md p-4 outline-dotted outline-2 xl:w-1/5">
        <DeleteAccountForm
          onSubmit={handleDeleteAccountSubmit}
          success={success}
          error={error}
        />
      </div>
    </div>
  )
}

export default SettingsPage
