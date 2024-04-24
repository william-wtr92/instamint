import type { GetServerSideProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

import getTranslationBaseImports from "@/web/utils/helpers/getTranslationBaseImports"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        ...getTranslationBaseImports(),
        "common",
      ])),
    },
  }
}

const Home = () => {
  return <div></div>
}
Home.title = "home"

export default Home
