import type { GetServerSideProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { Text } from "@instamint/ui-kit"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common", "navbar"])),
    },
  }
}

const Home = () => {
  const { t } = useTranslation(["common", "navbar"])

  return (
    <main className="flex items-center justify-center">
      <Text type="heading" variant="accent">
        {t("common:title")}
      </Text>
    </main>
  )
}
Home.title = "Instamint"

export default Home
