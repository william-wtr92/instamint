import {
  type ModifyPassword,
  type DeleteAccount,
  type ModifyEmail,
} from "@instamint/shared-types"
import { Button, Text } from "@instamint/ui-kit"
import type { GetServerSideProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import React, { type ReactElement, useCallback, useState } from "react"

import { DeleteAccountForm } from "@/web/components/forms/DeleteAccount"
import { ModifyEmailForm } from "@/web/components/forms/ModifyEmail"
import { ModifyPasswordForm } from "@/web/components/forms/ModifyPassword"
import SettingsLayout from "@/web/components/layout/SettingsLayout"
import TwoFactorAuthModal from "@/web/components/settings/TwoFactorAuthModal"
import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useUser } from "@/web/hooks/auth/useUser"
import { routes } from "@/web/routes"
import getTranslationBaseImports from "@/web/utils/helpers/getTranslationBaseImports"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        ...getTranslationBaseImports(),
        "profile-settings-security",
      ])),
    },
  }
}

const ProfileSettingsSecurityPage = () => {
  const { t } = useTranslation("profile-settings-security")

  const {
    services: {
      users: { deleteAccount, modifyPassword, modifyEmail },
      auth: { signOut },
    },
  } = useAppContext()
  const { redirect, toast } = useActionsContext()

  const { data, error, isLoading } = useUser()
  const user = !isLoading && !error ? data : null
  const is2faEnabled = user?.twoFactorAuthentication

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

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

  const handleModifyEmailSubmit = useCallback(
    async (values: ModifyEmail) => {
      const [err] = await modifyEmail(values)

      if (err) {
        toast({
          variant: "error",
          description: t(
            `errors:users.profile-settings.modify-email.${err.message}`
          ),
        })

        return
      }

      toast({
        variant: "success",
        description: t("profile-settings:modify-email.success"),
      })
      await signOut(null)

      redirect(routes.client.signIn, 3000)
    },
    [redirect, toast, modifyEmail, signOut, t]
  )

  return (
    <>
      <div className="animate-slideInFromLeft z-10 mx-auto flex flex-col gap-6 p-6 lg:w-[90%]">
        <Text type="heading" variant="neutral" className="text-center">
          {t("title")}
        </Text>

        <div className="flex flex-col gap-4">
          <Text type="subheading" variant="neutral">
            {t("2fa-title")}
          </Text>

          <Text type="medium" variant="neutral">
            {t("2fa-description")}
          </Text>

          <div
            className={`${is2faEnabled ? "border-accent-500 text-accent-500" : "border-error-primary text-error-primary"}  mx-auto flex w-fit flex-row items-center gap-2 rounded-md border-2 p-1.5 text-center`}
          >
            {is2faEnabled ? t("2fa-enabled") : t("2fa-disabled")}
          </div>

          <Button
            variant={is2faEnabled ? "danger" : "default"}
            onClick={handleOpenModal}
          >
            {is2faEnabled ? t("cta.deactivate-2fa") : t("cta.activate-2fa")}
          </Button>
        </div>

        <div className=" flex flex-col gap-6 xl:w-[25%]">
          <Button className="bg-accent-500 mt-6 py-2.5 font-semibold text-white">
            <ModifyEmailForm onSubmit={handleModifyEmailSubmit} />
          </Button>
          <Button className="bg-accent-500 mt-6 py-2.5 font-semibold text-white">
            <ModifyPasswordForm onSubmit={handleModifyPasswordSubmit} />
          </Button>
          <Button className="mt-6 bg-red-500 py-2.5 font-semibold text-white">
            <DeleteAccountForm onSubmit={handleDeleteAccountSubmit} />
          </Button>
        </div>
      </div>

      {isModalOpen && (
        <TwoFactorAuthModal
          isOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          is2faEnabled={is2faEnabled}
        />
      )}
    </>
  )
}
ProfileSettingsSecurityPage.title = "profile.settings.security"

ProfileSettingsSecurityPage.getLayout = (page: ReactElement) => {
  return <SettingsLayout>{page}</SettingsLayout>
}

export default ProfileSettingsSecurityPage
