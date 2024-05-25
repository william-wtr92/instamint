import { ArrowUturnLeftIcon, HeartIcon } from "@heroicons/react/24/outline"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  Text,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@instamint/ui-kit"
import Link from "next/link"
import React from "react"
import { useTranslation } from "react-i18next"

import { routes } from "@/web/routes"
import { firstLetter } from "@/web/utils/helpers/stringHelper"

type Props = {
  avatar: string | null
  username: string | undefined
  content: string
}

const PublicationCommentRow = (props: Props) => {
  const { avatar, username, content } = props
  const { t } = useTranslation("profile")

  const usernameFirstLetter = firstLetter(username)

  return (
    <div className="hover:bg-accent-300 flex w-full flex-row gap-2 p-2 duration-200">
      <div>
        <Avatar className="border-accent-500 size-8 border">
          {avatar ? (
            <AvatarImage src={avatar} alt={username} />
          ) : (
            <AvatarFallback>{usernameFirstLetter}</AvatarFallback>
          )}
        </Avatar>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="cursor-default text-left">
            <div className="flex-shrink-1 inline-block align-baseline leading-tight">
              <Link href={routes.client.profile.getProfile(username!)}>
                <Text
                  type="medium"
                  variant="none"
                  className="mr-2 inline font-bold"
                >
                  {username}
                </Text>
              </Link>

              <div className="inline">
                <Text
                  type="medium"
                  variant="none"
                  className="m-0 inline text-left font-normal"
                >
                  {content}
                </Text>
              </div>
            </div>
          </TooltipTrigger>

          <TooltipContent
            side="bottom"
            className="bg-accent-500 flex flex-row gap-2"
          >
            <HeartIcon
              title={t("publication-modal.icons.like-title")}
              className="size-6 text-white"
            />
            <ArrowUturnLeftIcon
              title={t("publication-modal.icons.reply-title")}
              className="size-6 text-white"
            />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default PublicationCommentRow
