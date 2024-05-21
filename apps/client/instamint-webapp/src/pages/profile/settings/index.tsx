import type { GetServerSideProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

import SettingsPageContainer from "@/web/components/layout/SettingsPageContainer"
import getTranslationBaseImports from "@/web/utils/helpers/getTranslationBaseImports"
import getSettingsLayout from "@/web/utils/layout/getSettingsLayout"

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
    <SettingsPageContainer>
      <div className="flex flex-grow flex-col gap-5 border border-blue-500 p-5"></div>
    </SettingsPageContainer>
  )
}
SettingsPage.title = "profile.settings.general"

SettingsPage.getLayout = getSettingsLayout

export default SettingsPage
