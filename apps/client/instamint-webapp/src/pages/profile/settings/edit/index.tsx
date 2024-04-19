import type { GetServerSideProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import type { ReactElement } from "react"
import React from "react"

import getTranslationBaseImports from "@/web/utils/helpers/getTranslationBaseImports"
import SettingsLayout from "@/web/components/layout/SettingsLayout"

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

const ProfileSettingsEditPage = () => {
  return <div className="animate-slideInFromLeft z-10 bg-red-500 p-8"></div>
}
ProfileSettingsEditPage.title = "profile.settings.edit"

ProfileSettingsEditPage.getLayout = (page: ReactElement) => {
  return <SettingsLayout>{page}</SettingsLayout>
}

export default ProfileSettingsEditPage
