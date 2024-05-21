import type { GetServerSideProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import React from "react"

import SettingsPageContainer from "@/web/components/layout/SettingsPageContainer"
import getTranslationBaseImports from "@/web/utils/helpers/getTranslationBaseImports"
import getSettingsLayout from "@/web/utils/layout/getSettingsLayout"

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

const ProfileSettingsNotificationsPage = () => {
  return (
    <SettingsPageContainer>
      <p>dzakdzalkl</p>
    </SettingsPageContainer>
  )
}
ProfileSettingsNotificationsPage.title = "profile.settings.notifications"

ProfileSettingsNotificationsPage.getLayout = getSettingsLayout

export default ProfileSettingsNotificationsPage
