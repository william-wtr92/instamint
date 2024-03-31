import Head from "next/head"
import type { GetServerSideProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  }
}

const Home = () => {
  const { t } = useTranslation("common")


  return (
    <>
      <Head>
        <title>Instamint</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center items-center h-screen">
        <h1 className="font-bold text-6xl">{t("title")}</h1>
      </main>
    </>
  )
}

export default Home
