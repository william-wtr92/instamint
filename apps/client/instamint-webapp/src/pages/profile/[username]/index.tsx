import type { Publication } from "@instamint/shared-types"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useEffect, useState, useRef } from "react"
import { useTranslation } from "react-i18next"

import { ProfileHeader } from "@/web/components/profile/ProfileHeader"
import { PublicationsList } from "@/web/components/profile/PublicationsList"
import { useUser } from "@/web/hooks/auth/useUser"
import { useGetPublicationsFromUser } from "@/web/hooks/publications/useGetPublicationsFromUser"
import getTranslationBaseImports from "@/web/utils/helpers/getTranslationBaseImports"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale, params } = context

  const username = params?.username as string

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        ...getTranslationBaseImports(),
        "profile",
      ])),
      username,
    },
  }
}

const ProfilePage = (
  _props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { t } = useTranslation("profile")
  const { username } = _props

  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  const { data: userData } = useUser()

  const { data, isLoading, setSize } = useGetPublicationsFromUser(username)
  const publications = data
    ? data.reduce(
        (acc: Publication[], { result }) => [...acc, ...result.publications],
        []
      )
    : []

  const [pageTitle, setPageTitle] = useState<string>("")

  const handleSetSize = () => {
    setSize((prevState) => prevState + 1)
  }

  const onScroll = () => {
    if (!scrollContainerRef.current) {
      return
    }

    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current

      if (scrollTop + clientHeight >= scrollHeight - 5) {
        handleSetSize()
      }
    }
  }

  useEffect(() => {
    const translatedTitle = `${t("titles:profile.user")} ${username}`
    setPageTitle(translatedTitle)
  }, [username, t])

  useEffect(() => {
    document.title = pageTitle
  }, [pageTitle])

  return (
    <div
      ref={scrollContainerRef}
      className="p-text-large-screen flex h-full flex-col gap-6 overflow-scroll xl:h-screen"
      onScroll={onScroll}
    >
      {userData && (
        <>
          <ProfileHeader username={username} />

          <PublicationsList publications={publications} isLoading={isLoading} />
        </>
      )}
    </div>
  )
}

ProfilePage.title = "profile.user"

export default ProfilePage
