import { useCallback } from "react"
import type { GetServerSideProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import type { ReactElement } from "react"
import React from "react"
import {
  type ModifyPassword,
  type DeleteAccount,
} from "@instamint/shared-types"

import getTranslationBaseImports from "@/web/utils/helpers/getTranslationBaseImports"
import SettingsLayout from "@/web/components/layout/SettingsLayout"
import useAppContext from "@/web/contexts/useAppContext"
import useActionsContext from "@/web/contexts/useActionsContext"
import { DeleteAccountForm } from "@/web/components/forms/DeleteAccount"
import { ModifyPasswordForm } from "@/web/components/forms/ModifyPassword"
import { routes } from "@/web/routes"
import { Button } from "@instamint/ui-kit"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        ...getTranslationBaseImports(),
        "profile-settings-edit",
      ])),
    },
  }
}

const ProfileSettingsSecurityPage = () => {
  const { t } = useTranslation(["errors", "profile-settings"])

  const {
    services: {
      users: { deleteAccount, modifyPassword },
      auth: { signOut },
    },
  } = useAppContext()
  const { redirect, toast } = useActionsContext()

  const handleDeleteAccountSubmit = useCallback(
    async (values: DeleteAccount) => {
      const [err] = await deleteAccount(values)

      if (err) {
        toast({
          variant: "error",
          description: t(
            `errors:users.profile-settings.delete-account.${err.message}`
          ),
        })

        return
      }

      toast({
        variant: "success",
        description: t("profile-settings:delete-account.success"),
      })
      redirect(routes.client.home, 3000)
    },
    [redirect, toast, deleteAccount, t]
  )

  const handleModifyPasswordSubmit = useCallback(
    async (values: ModifyPassword) => {
      const [err] = await modifyPassword(values)

      if (err) {
        toast({
          variant: "error",
          description: t(
            `errors:users.profile-settings.modify-password.${err.message}`
          ),
        })

        return
      }

      toast({
        variant: "success",
        description: t("profile-settings:modify-password.success"),
      })
      await signOut(null)

      redirect(routes.client.signIn, 3000)
    },
    [redirect, toast, modifyPassword, signOut, t]
  )

  return (
    <div className="animate-slideInFromLeft z-10 p-8">
      <div className=" flex flex-col gap-6 xl:w-[25%]">
        <Button className="bg-accent-500 mt-6 py-2.5 font-semibold text-white">
          <ModifyPasswordForm onSubmit={handleModifyPasswordSubmit} />
        </Button>

        <Button className="mt-6 bg-red-500 py-2.5 font-semibold text-white">
          <DeleteAccountForm onSubmit={handleDeleteAccountSubmit} />
        </Button>
      </div>
    </div>
  )
}
ProfileSettingsSecurityPage.title = "profile.settings.security"

ProfileSettingsSecurityPage.getLayout = (page: ReactElement) => {
  return <SettingsLayout>{page}</SettingsLayout>
}

export default ProfileSettingsSecurityPage
