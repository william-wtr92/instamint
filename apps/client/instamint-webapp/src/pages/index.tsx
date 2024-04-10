import type { GetServerSideProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common", "navbar"])),
    },
  }
}

const Home = () => {
  return <div>test</div>
}
Home.title = "Instamint"

export default Home
