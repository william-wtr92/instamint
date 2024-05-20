import { EnvelopeIcon } from "@heroicons/react/24/outline"
import { type UploadPublication } from "@instamint/shared-types"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Text,
} from "@instamint/ui-kit"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Image from "next/image"
import Link from "next/link"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useCallback, useEffect, useState, useRef } from "react"
import { useTranslation } from "react-i18next"

import { UploadPublicationForm } from "@/web/components/forms/UploadPublication"
import { config } from "@/web/config"
import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useUser } from "@/web/hooks/auth/useUser"
import { usePublication } from "@/web/hooks/publications/usePublication"
import { useUserByUsername } from "@/web/hooks/users/useUserByUsername"
import { routes } from "@/web/routes"
import getTranslationBaseImports from "@/web/utils/helpers/getTranslationBaseImports"
import { firstLetterUppercase } from "@/web/utils/helpers/stringHelper"

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
  const { username } = _props
  const { t } = useTranslation()

  const {
    socket: { joinRoom },
    services: {
      users: { uploadPublication },
    },
  } = useAppContext()
  const { redirect, toast } = useActionsContext()
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

  const [pageTitle, setPageTitle] = useState<string>("")

  const userUsername = firstLetterUppercase(userTargetedData?.username)
  const usernameFirstLetter = userUsername?.charAt(0).toUpperCase()

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
  }, [setSize, isReachingEnd])

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
      redirect(routes.client.home, 0)
    }
  }, [isError, redirect])

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

  const onSubmit = useCallback(
    async (values: UploadPublication) => {
      if (values.image !== undefined) {
        const [err] = await uploadPublication({ image: values.image })

        if (err) {
          toast({
            variant: "error",
            description: t(`errors:users.publication.image.${err.message}`),
          })

          return
        }
      }

      toast({
        variant: "success",
        description: t("add-publication.success"),
      })
    },
    [uploadPublication, toast, t]
  )

  useEffect(() => {
    const translatedTitle = `Instamint - @${username}`
    setPageTitle(translatedTitle)
  }, [username])

  useEffect(() => {
    document.title = pageTitle
  }, [pageTitle])

  return (
    <>
      <div className="p-text-large-screen flex h-[60vh] flex-col gap-6 xl:h-screen">
        <div className="border-1 ml-4 mt-4 flex w-[95%] flex-row justify-start gap-2.5 rounded-md border-dashed p-4 xl:w-[95%]">
          <Avatar className="relative left-1.5 size-12 rounded-3xl outline-dotted outline-2 outline-offset-2 outline-neutral-400 xl:size-28">
            {userTargetedData?.avatar !== null ? (
              <AvatarImage
                src={config.api.blobUrl + userTargetedData?.avatar}
                alt={userUsername}
              />
            ) : (
              <AvatarFallback>{usernameFirstLetter}</AvatarFallback>
            )}
          </Avatar>
          <div className="ml-4 flex flex-col justify-between">
            <div className="flex flex-row pt-2">
              <Text variant="neutral" type="body" className="p-1 pr-4">
                {userUsername}
              </Text>
              <Link
                href={routes.client.profile.settings.edit}
                className="bg-accent-200 flex flex-row items-center justify-between rounded-lg p-1"
              >
                <Text type="medium" variant="neutral" className="font-normal">
                  {t("settings.accountInformation")}
                </Text>
              </Link>
            </div>
            <div className="P-1 flex flex-row pt-2">
              <Text variant="neutral" type="body" className="pr-4">
                {publications?.length + " " + t("publications")}
              </Text>
              <Text variant="neutral" type="body" className="pr-4">
                {followersTargetedData?.count + " " + t("followers")}
              </Text>
              <Text variant="neutral" type="body" className="pr-4">
                {followedTargetedData?.count + " " + t("followed")}
              </Text>
            </div>
            <Text variant="neutral" type="body" className="pt-3">
              {userTargetedData?.bio}
            </Text>
            {userTargetedData?.email !== userData?.email ? (
              <EnvelopeIcon
                className="size-6 hover:scale-105 hover:cursor-pointer"
                onClick={handleDmUser}
              />
            ) : null}
          </div>
          <Button className="bg-neutral m-5 rounded-full">
            <UploadPublicationForm onSubmit={onSubmit} />
          </Button>
        </div>
        <div
          className="p-text-large-screen border-1 scrollbar-thin scrollbar-thumb-accent-400 scrollbar-track-neutral-100 grid h-[85%] grid-cols-3 gap-1 overflow-y-auto rounded-md"
          ref={scrollContainerRef}
        >
          {publications.map((publication) => (
            <Image
              key={publication?.id}
              src={config.api.blobUrl + publication?.image}
              alt="post"
              width={250}
              height={250}
              className="h-[250px] w-[250px]"
            />
          ))}
          {isLoading && <p>{t("message:loading")}</p>}
        </div>
      </div>
    </>
  )
}

ProfilePage.title = "profile.user"

export default ProfilePage
