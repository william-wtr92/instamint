import { EnvelopeIcon, UserCircleIcon } from "@heroicons/react/24/outline"
import { Text } from "@instamint/ui-kit"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useCallback, useEffect, useState } from "react"

import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useUser } from "@/web/hooks/auth/useUser"
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
  } = useAppContext()
  const { redirect } = useActionsContext()
  const { data: userData } = useUser()
  const { data: userTargetedData } = useUserByUsername({ username })

  const [pageTitle, setPageTitle] = useState<string>("")

  const userUsername = firstLetterUppercase(userTargetedData?.username)

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

  return (
    <div className="border-1 ml-3 mt-4 flex w-4/5 flex-col justify-center gap-2.5 rounded-md border-dashed p-4 xl:w-1/2">
      <UserCircleIcon className="size-8" />
      <div className="ml-1 flex justify-between">
        <Text type={"body"} variant={"none"}>
          {userUsername}
        </Text>
        {userTargetedData?.email !== userData?.email ? (
          <EnvelopeIcon
            className="size-6 hover:scale-105 hover:cursor-pointer"
            onClick={handleDmUser}
          />
        ) : null}
      </div>
    </div>
  )
}

ProfilePage.title = "profile.user"

export default ProfilePage
