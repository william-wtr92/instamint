import { type Publication, type FollowPending } from "@instamint/shared-types"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useEffect, useState, useRef, useCallback } from "react"
import { useTranslation } from "react-i18next"

import { ProfileHeader } from "@/web/components/profile/ProfileHeader"
import { PublicationsList } from "@/web/components/profile/PublicationsList"
import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useUser } from "@/web/hooks/auth/useUser"
import { useGetPublicationsFromUser } from "@/web/hooks/publications/useGetPublicationsFromUser"
import { useUserFollowRequests } from "@/web/hooks/users/profile/useUserFollowRequests"
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

  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  const {
    services: {
      profile: { follow, unfollow, followRequest, deleteFollowRequest },
    },
    socket: { joinRoom },
  } = useAppContext()
  const { redirect, toast } = useActionsContext()

  const { data: userData } = useUser()
  const {
    data: userTargetedData,
    followers: followersTargetedData,
    followed: followedTargetedData,
    isFollowing,
    requestPending,
    mutate: userTargetedMutate,
  } = useUserByUsername({ username })
  const { data: userFollowRequestsData, mutate: userFollowRequestsMutate } =
    useUserFollowRequests()

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

  const handleFollowUser = useCallback(async () => {
    const [err] = await follow({ username })

    if (err) {
      toast({
        variant: "error",
        description: t(`errors:users.profile.follow.${err.message}`),
      })

      return
    }

    toast({
      variant: "success",
      description: t("profile:actions.messages.followSuccess", { username }),
    })

    await userTargetedMutate()
    await userFollowRequestsMutate()
  }, [follow, userTargetedMutate, userFollowRequestsMutate, username, toast, t])

  const handleUnfollowUser = useCallback(async () => {
    const [err] = await unfollow({ username })

    if (err) {
      toast({
        variant: "error",
        description: t(`errors:users.profile.follow.${err.message}`),
      })

      return
    }

    toast({
      variant: "success",
      description: t("profile:actions.messages.unfollowSuccess", { username }),
    })

    await userTargetedMutate()
    await userFollowRequestsMutate()
  }, [
    unfollow,
    userTargetedMutate,
    userFollowRequestsMutate,
    username,
    toast,
    t,
  ])

  const handleTriggerFollowRequest = useCallback(
    async (values: FollowPending) => {
      const [err] = await followRequest(values)

      if (err) {
        toast({
          variant: "error",
          description: t(`errors:users.profile.follow.${err.message}`),
        })

        return
      }

      toast({
        variant: "success",
        description: t(
          `profile:actions.messages.${values.accepted ? "acceptFollowRequestSuccess" : "rejectFollowRequestSuccess"}`,
          {
            username: values.username,
          }
        ),
      })

      await userTargetedMutate()
      await userFollowRequestsMutate()
    },
    [followRequest, userTargetedMutate, userFollowRequestsMutate, toast, t]
  )

  const handleDeleteFollowRequest = useCallback(async () => {
    const [err] = await deleteFollowRequest({ username })

    if (err) {
      toast({
        variant: "error",
        description: t(`errors:users.profile.follow.${err.message}`),
      })

      return
    }

    toast({
      variant: "success",
      description: t("profile:actions.messages.deleteRequestSuccess", {
        username,
      }),
    })

    await userTargetedMutate()
  }, [deleteFollowRequest, userTargetedMutate, username, toast, t])

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
  }, [joinRoom, redirect, userTargetedData])

  useEffect(() => {
    const translatedTitle = `${t("titles:profile.user")}${username}`
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
          <ProfileHeader
            userEmail={userData?.email}
            userPage={userTargetedData}
            userFollowRequests={
              userData?.private ? userFollowRequestsData : undefined
            }
            handleFollow={handleFollowUser}
            handleUnfollow={handleUnfollowUser}
            handleTriggerFollowRequest={(values) =>
              handleTriggerFollowRequest(values)
            }
            handleDeleteFollowRequest={handleDeleteFollowRequest}
            handleDmUser={handleDmUser}
            publications={publications}
            followers={followersTargetedData}
            followed={followedTargetedData}
            isFollowing={isFollowing}
            requestPending={requestPending}
          />

          <PublicationsList publications={publications} isLoading={isLoading} />
        </>
      )}
    </div>
  )
}

ProfilePage.title = "profile.user"

export default ProfilePage
