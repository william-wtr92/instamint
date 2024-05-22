import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useCallback, useEffect, useState, useRef } from "react"
import { useTranslation } from "react-i18next"

import { ProfileHeader } from "@/web/components/profile/ProfileHeader"
import { PublicationsGrid } from "@/web/components/profile/PublicationsGrid"
import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useUser } from "@/web/hooks/auth/useUser"
import { usePublication } from "@/web/hooks/publications/usePublication"
import { useUserByUsername } from "@/web/hooks/users/useUserByUsername"
import { routes } from "@/web/routes"
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
  const {
    socket: { joinRoom },
  } = useAppContext()
  const { redirect } = useActionsContext()

  const { data: userData } = useUser()
  const {
    data: userTargetedData,
    followers: followersTargetedData,
    followed: followedTargetedData,
  } = useUserByUsername({ username })
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const { publications, isLoading, setSize, isReachingEnd, isError } =
    usePublication()

  const [isAtBottom, setIsAtBottom] = useState<boolean>(true)
  const [isClient, setIsClient] = useState<boolean>(false)
  const [pageTitle, setPageTitle] = useState<string>("")
  const [havePublication, setHavePublication] = useState<boolean>(false)

  const handleScroll = useCallback(() => {
    const scrollContainer = scrollContainerRef.current

    if (!scrollContainer) {
      return
    }

    const { scrollTop, scrollHeight, clientHeight } = scrollContainer

    if (scrollTop === 0 && !isReachingEnd) {
      setSize((size) => size + 1)
      scrollContainer.scrollTop = 10

      return
    }

    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10)
  }, [setSize, isReachingEnd, setIsAtBottom])

  const handleDmUser = useCallback(() => {
    if (!userTargetedData) {
      return
    }

    joinRoom(
      { userTargetedUsername: userTargetedData.username },
      (roomName: string) => {
        redirect(routes.client.messages(roomName), 800)
      }
    )
  }, [userTargetedData, joinRoom, redirect])

  useEffect(() => {
    const translatedTitle = `${t("titles:profile.user")} ${username}`
    setPageTitle(translatedTitle)
  }, [username, t])

  useEffect(() => {
    document.title = pageTitle
  }, [pageTitle])

  useEffect(() => {
    if (publications.length > 0) {
      setHavePublication(true)
    }
  }, [setHavePublication, publications])

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current

    if (scrollContainer && isAtBottom) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  }, [publications, isAtBottom])

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    scrollContainer?.addEventListener("scroll", handleScroll)

    return () => {
      scrollContainer?.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  useEffect(() => {
    if (isError) {
      redirect(routes.client.home)
    }
  }, [isError, redirect])

  useEffect(() => {
    setIsClient(true)
  }, [setIsClient])

  return (
    <div className="p-text-large-screen flex h-[60vh] flex-col gap-6 xl:h-screen">
      {isClient && (
        <>
          <ProfileHeader
            userEmail={userData?.email}
            userPage={userTargetedData}
            handleDmUser={handleDmUser}
            publications={publications}
            followers={followersTargetedData?.count}
            followed={followedTargetedData?.count}
          />
          <PublicationsGrid
            publications={publications}
            isLoading={isLoading}
            havePublication={havePublication}
            scrollContainerRef={scrollContainerRef}
          />
        </>
      )}
    </div>
  )
}

ProfilePage.title = "profile.user"

export default ProfilePage
