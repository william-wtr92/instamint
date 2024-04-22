import { type ReactElement } from "react"
import type { GetServerSideProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

import getTranslationBaseImports from "@/web/utils/helpers/getTranslationBaseImports"
import SettingsLayout from "@/web/components/layout/SettingsLayout"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        ...getTranslationBaseImports(),
        "profile-settings",
      ])),
    },
  }
}

const SettingsPage = () => {
  return (
    <div className="animate-slideInFromLeft z-10 flex justify-start gap-4 border border-red-500 p-4">
      <div className="flex flex-grow flex-col gap-5 border border-blue-500 p-5"></div>
    </div>
  )
}
SettingsPage.title = "profile.settings.general"

SettingsPage.getLayout = (page: ReactElement) => {
  return <SettingsLayout>{page}</SettingsLayout>
}

export default SettingsPage
