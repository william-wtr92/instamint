import {
  type Visibility,
  type ModifyPassword,
  type DeleteAccount,
  type ModifyEmail,
} from "@instamint/shared-types"
import { Button, Text } from "@instamint/ui-kit"
import type { GetServerSideProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import React, { useCallback, useState } from "react"

import { DeleteAccountForm } from "@/web/components/forms/DeleteAccount"
import { ModifyEmailForm } from "@/web/components/forms/ModifyEmail"
import { ModifyPasswordForm } from "@/web/components/forms/ModifyPassword"
import { VisibilityAccount } from "@/web/components/forms/Visibility"
import SettingsPageContainer from "@/web/components/layout/SettingsPageContainer"
import TwoFactorAuthModal from "@/web/components/settings/TwoFactorAuthModal"
import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useUser } from "@/web/hooks/auth/useUser"
import { routes } from "@/web/routes"
import getTranslationBaseImports from "@/web/utils/helpers/getTranslationBaseImports"
import getSettingsLayout from "@/web/utils/layout/getSettingsLayout"

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
      users: { deleteAccount, modifyPassword, modifyEmail, visibility },
      auth: { signOut },
    },
  } = useAppContext()
  const { redirect, toast } = useActionsContext()

  const { data, error, isLoading } = useUser()
  const user = !isLoading && !error ? data : null
  const is2faEnabled = user?.twoFactorAuthentication

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const handleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev)
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
        description: t("profile-settings-security:delete-account.success"),
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
        description: t("profile-settings-security:modify-password.success"),
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
        description: t("profile-settings-security:modify-email.success"),
      })
      await signOut(null)

      redirect(routes.client.signIn, 3000)
    },
    [redirect, toast, modifyEmail, signOut, t]
  )

  const handleVisibilitySubmit = useCallback(
    async (values: Visibility) => {
      const [err] = await visibility(values)

      if (err) {
        toast({
          variant: "error",
          description: t(
            `errors:users.profile-settings.security.visibility.${err.message}`
          ),
        })

        return
      }

      toast({
        variant: "success",
        description: t(
          `profile-settings-security:visibility.messages.${values.isPrivate ? "private" : "public"}`
        ),
      })
    },
    [visibility, toast, t]
  )

  return (
    <>
      <SettingsPageContainer>
        <Text type="heading" variant="neutral" className="text-center">
          {t("title")}
        </Text>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-3 xl:flex-row">
            <Text
              type="subheading"
              variant="neutral"
              className="whitespace-nowrap"
            >
              {t("2fa-title")}
            </Text>
            <div
              className={`${is2faEnabled ? "border-accent-500 text-accent-500" : "border-error-primary text-error-primary"} text-small xl:text-medium flex w-fit flex-row items-center gap-2 whitespace-nowrap rounded-md border-2 px-2 py-0.5 text-center`}
            >
              {is2faEnabled ? t("2fa-enabled") : t("2fa-disabled")}
            </div>
          </div>

          <Text type="medium" variant="neutral">
            {t("2fa-description")}
          </Text>

          <Button
            variant={is2faEnabled ? "danger" : "default"}
            onClick={handleModal}
          >
            {is2faEnabled ? t("cta.deactivate-2fa") : t("cta.activate-2fa")}
          </Button>
        </div>

        <div className="flex flex-col gap-6 border-t-2 border-neutral-300 border-opacity-35 xl:flex-row xl:justify-center xl:gap-40">
          <div className="mt-4">
            <Text type="subheading" variant="neutral" className="text-center">
              {t("profile-settings-security:subtitle-actions")}
            </Text>
            <div className="flex justify-center gap-3">
              <Button className="bg-accent-500 mt-6 py-2.5 font-semibold text-white">
                <ModifyEmailForm onSubmit={handleModifyEmailSubmit} />
              </Button>
              <Button className="bg-accent-500 mt-6 py-2.5 font-semibold text-white">
                <ModifyPasswordForm onSubmit={handleModifyPasswordSubmit} />
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-col xl:justify-center">
            <Text type="subheading" variant="neutral" className="text-center">
              {t("profile-settings-security:subtitle-danger-zone")}
            </Text>
            <div className="flex justify-center gap-3">
              <Button className="mt-6 bg-red-500 py-2.5 font-semibold text-white">
                <DeleteAccountForm onSubmit={handleDeleteAccountSubmit} />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-neutral-300 border-opacity-35">
          <Text
            type="subheading"
            variant="neutral"
            className="mt-4 text-center xl:text-left"
          >
            {t("profile-settings-security:subtitle-visibility")}
          </Text>
          <VisibilityAccount
            isPrivate={data?.private}
            onSubmit={(values) => handleVisibilitySubmit(values)}
          />
        </div>
      </SettingsPageContainer>

      {isModalOpen && (
        <TwoFactorAuthModal
          isOpen={isModalOpen}
          handleModal={handleModal}
          is2faEnabled={is2faEnabled}
        />
      )}
    </>
  )
}
ProfileSettingsSecurityPage.title = "profile.settings.security"

ProfileSettingsSecurityPage.getLayout = getSettingsLayout

export default ProfileSettingsSecurityPage
