import type { GetServerSideProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import React, { type ReactElement } from "react"

import SettingsLayout from "@/web/components/layout/SettingsLayout"
import getTranslationBaseImports from "@/web/utils/helpers/getTranslationBaseImports"

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
  return <div className="animate-slideInFromLeft z-10 p-8"></div>
}
ProfileSettingsNotificationsPage.title = "profile.settings.notifications"

ProfileSettingsNotificationsPage.getLayout = (page: ReactElement) => {
  return <SettingsLayout>{page}</SettingsLayout>
}

export default ProfileSettingsNotificationsPage
