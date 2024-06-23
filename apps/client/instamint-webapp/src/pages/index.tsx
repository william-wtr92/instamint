import type { Publication } from "@instamint/shared-types"
import type { GetServerSideProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

import FeedPublicationCard from "@/web/components/publications/feed/FeedPublicationCard"
import { useGetFeedPublications } from "@/web/hooks/publications/useGetFeedPublications"
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
  const { data: feedPublicationsData } = useGetFeedPublications()
  const publications = feedPublicationsData?.flatMap(
    (page) => page.result.publications
  )

  return (
    <div className="no-scrollbar flex w-full flex-col items-center gap-4 overflow-scroll p-4">
      {publications?.map((publication: Publication) => (
        <FeedPublicationCard key={publication.id} publication={publication} />
      ))}
    </div>
  )
}
Home.title = "home"

export default Home
