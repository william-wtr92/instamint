import type { GetServerSideProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import type { ReactElement } from "react"
import React, { useCallback, useState } from "react"

import getTranslationBaseImports from "@/web/utils/helpers/getTranslationBaseImports"
import SettingsLayout from "@/web/components/layout/SettingsLayout"
import { Button, Text } from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import { useUser } from "@/web/hooks/auth/useUser"
import EnableTwoFactorAuthModal from "@/web/components/settings/EnableTwoFactorAuthModal"
import DisableTwoFactorAuthModal from "@/web/components/settings/DisableTwoFactorAuthModal"

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

          <div className="border-accent-500 text-accent-500 mx-auto w-fit rounded-sm border-2 p-1.5 text-center">
            {is2faEnabled ? t("2fa-enabled") : t("2fa-disabled")}
          </div>

          <Button variant="default" onClick={handleOpenModal}>
            {is2faEnabled ? t("cta.desactivate-2fa") : t("cta.activate-2fa")}
          </Button>
        </div>
      </div>

      {isModalOpen &&
        (!is2faEnabled ? (
          <EnableTwoFactorAuthModal
            isOpen={isModalOpen}
            handleCloseModal={handleCloseModal}
          />
        ) : (
          <DisableTwoFactorAuthModal
            isOpen={isModalOpen}
            handleCloseModal={handleCloseModal}
          />
        ))}
    </>
  )
}
ProfileSettingsSecurityPage.title = "profile.settings.security"

ProfileSettingsSecurityPage.getLayout = (page: ReactElement) => {
  return <SettingsLayout>{page}</SettingsLayout>
}

export default ProfileSettingsSecurityPage
