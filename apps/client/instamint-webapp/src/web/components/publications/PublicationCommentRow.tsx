import { ArrowUturnLeftIcon, HeartIcon } from "@heroicons/react/24/outline"
import { TrashIcon } from "@heroicons/react/24/solid"
import type { CommentUser } from "@instamint/shared-types"
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
import { useTranslation } from "next-i18next"
import React, { useCallback, useMemo, useState } from "react"

import { AlertPopup } from "@/web/components/utils/AlertPopup"
import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useUser } from "@/web/hooks/auth/useUser"
import { usePublication } from "@/web/hooks/publications/usePublication"
import { useUserByUsername } from "@/web/hooks/users/useUserByUsername"
import { routes } from "@/web/routes"
import { firstLetter } from "@/web/utils/helpers/stringHelper"

type Props = {
  avatar: string | null
  username: string
  content: string
  hashtags?: string[]
  isDescription?: boolean

  commentUser?: CommentUser
  commentId?: number
  publicationId?: number
  publicationAuthorId?: number
}

const PublicationCommentRow = (props: Props) => {
  const {
    avatar,
    username,
    content,
    hashtags,
    isDescription,

    commentUser,
    commentId,
    publicationId,
    publicationAuthorId,
  } = props
  const { t } = useTranslation("profile")

  const { data: userConnectedData, isLoading: isLoadingUserConnected } =
    useUser()
  const userConnected = isLoadingUserConnected ? null : userConnectedData

  const { data: userByUsernameData, isLoading: isLoadingUserByUsername } =
    useUserByUsername({
      username,
    })
  const userFromUsername = isLoadingUserByUsername ? null : userByUsernameData
  const usernameFirstLetter = firstLetter(username)

  const { mutate } = usePublication()

  const {
    services: {
      users: { deletePublicationCommentService },
    },
  } = useAppContext()

  const { toast } = useActionsContext()

  const [showDeleteCommentDialog, setShowDeleteCommentDialog] =
    useState<boolean>(false)

  const handleShowDeleteCommentDialog = () => {
    setShowDeleteCommentDialog((prevState) => !prevState)
  }

  const deleteComment = useCallback(async () => {
    if (!commentId || !publicationId) {
      return
    }

    const [err] = await deletePublicationCommentService({
      commentId: commentId.toString(),
      publicationId: publicationId.toString(),
    })

    if (err) {
      toast({
        variant: "error",
        description: err.message,
      })

      return
    }

    await mutate()
  }, [commentId, deletePublicationCommentService, mutate, publicationId, toast])

  const deleteCommentButton = useMemo(() => {
    if (
      userFromUsername?.id === commentUser?.id ||
      userConnected?.id === publicationAuthorId
    ) {
      return (
        <TrashIcon
          title={t("publication-modal.icons.delete-title")}
          className="size-6 cursor-pointer text-white"
          onClick={handleShowDeleteCommentDialog}
        />
      )
    }
  }, [userFromUsername, commentUser, userConnected, publicationAuthorId, t])

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="text-left">
            <div
              className={`flex flex-row items-start gap-2 ${isDescription ? "border-b-1 border-neutral-200" : "peer-hover:bg-accent-300 hover:bg-accent-300"} p-2`}
            >
              <Avatar className="border-accent-500 size-8 border">
                {avatar ? (
                  <AvatarImage src={avatar} alt={username} />
                ) : (
                  <AvatarFallback>{usernameFirstLetter}</AvatarFallback>
                )}
              </Avatar>

              {/* Width calculation (mostly for text to make it wrap) : modal width - image size - (padding + gap + avatar) */}
              {/* 56px is : avatar size(32px) + X-padding (8px + 8px) + gap-2 (8px) */}
              <div className="flex w-[calc(90vw-56px)] flex-col md:w-[calc(95vw-70vh-56px)] lg:w-[calc(80vw-80vh-56px)]">
                <Text
                  type="medium"
                  variant="none"
                  className="break-word max-w-full text-pretty break-words"
                >
                  <Link
                    href={routes.client.profile.getProfile(username!)}
                    className="float-left mr-1.5 font-bold"
                  >
                    {username}
                  </Link>

                  <p className="font-normal">{content}</p>
                </Text>

                {hashtags && hashtags.length > 0 && (
                  <div className="mt-2 flex flex-row justify-start gap-1">
                    {hashtags.map((hashtag, index) => (
                      <Text
                        key={index}
                        type="small"
                        variant="none"
                        className="text-neutral-300"
                      >
                        {hashtag}
                      </Text>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TooltipTrigger>

          {isDescription === undefined && (
            <TooltipContent
              side="bottom"
              sideOffset={-10}
              className="bg-accent-500 peer flex flex-row gap-2"
            >
              <HeartIcon
                title={t("publication-modal.icons.like-title")}
                className="size-6 cursor-pointer text-white"
              />

              <ArrowUturnLeftIcon
                title={t("publication-modal.icons.reply-title")}
                className="size-6 cursor-pointer text-white"
              />

              {deleteCommentButton}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <AlertPopup
        type="danger"
        open={showDeleteCommentDialog}
        onClose={handleShowDeleteCommentDialog}
        onConfirm={deleteComment}
        titleKey={t("publication-modal.delete-comment-modal.title")}
        descriptionKey={t("publication-modal.delete-comment-modal.description")}
        cancelKey={t("publication-modal.delete-comment-modal.cancel")}
        confirmKey={t("publication-modal.delete-comment-modal.confirm")}
      />
    </>
  )
}

export default PublicationCommentRow
