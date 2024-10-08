import {
  ArrowUturnLeftIcon,
  HeartIcon,
  TrashIcon,
} from "@heroicons/react/24/solid"
import type { CommentUser } from "@instamint/shared-types"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import React, { useCallback, useMemo, useState, type ReactNode } from "react"

import { AlertPopup } from "@/web/components/utils/AlertPopup"
import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useUser } from "@/web/hooks/auth/useUser"
import { useGetPublicationById } from "@/web/hooks/publications/useGetPublicationById"

type Props = {
  children: ReactNode
  commentId: number | undefined
  commentAuthor: CommentUser | undefined
  commentParentId: number | null | undefined
  publicationAuthorId: number | undefined
  isLiked: boolean | undefined
  isDescription?: boolean
  handleReplyCommentUser: () => void
}

const CommentWithActions = (props: Props) => {
  const {
    children,
    commentId,
    commentAuthor,
    commentParentId,
    publicationAuthorId,
    isLiked,
    isDescription,
    handleReplyCommentUser,
  } = props
  const { t } = useTranslation("profile")

  const {
    services: {
      users: { likePublicationCommentService, deletePublicationCommentService },
    },
    publicationId,
  } = useAppContext()

  const { toast } = useActionsContext()

  const { mutate: refreshPublication } = useGetPublicationById(publicationId)

  const { data: userConnectedData, isLoading: isLoadingUserConnected } =
    useUser()
  const userConnected = isLoadingUserConnected ? null : userConnectedData

  const [showDeleteCommentDialog, setShowDeleteCommentDialog] =
    useState<boolean>(false)

  const handleShowDeleteCommentDialog = useCallback(() => {
    setShowDeleteCommentDialog((prevState) => !prevState)
  }, [])

  const replyCommentButton = useMemo(() => {
    if (!commentParentId) {
      return (
        <ArrowUturnLeftIcon
          title={t("publication-modal:icons.reply-title")}
          className="size-6 cursor-pointer text-white"
          onClick={handleReplyCommentUser}
        />
      )
    }
  }, [commentParentId, handleReplyCommentUser, t])

  const deleteCommentButton = useMemo(() => {
    if (
      userConnected?.id === commentAuthor?.id ||
      userConnected?.id === publicationAuthorId
    ) {
      return (
        <TrashIcon
          title={t("publication-modal:icons.delete-title")}
          className="size-6 cursor-pointer text-white"
          onClick={handleShowDeleteCommentDialog}
        />
      )
    }
  }, [
    userConnected?.id,
    commentAuthor?.id,
    publicationAuthorId,
    t,
    handleShowDeleteCommentDialog,
  ])

  const handleLikeComment = useCallback(async () => {
    if (!commentId || !publicationId) {
      return
    }

    const [err] = await likePublicationCommentService({
      commentId: commentId.toString(),
      publicationId: publicationId.toString(),
    })

    if (err) {
      toast({
        variant: "error",
        description: t(`errors:users.publications.comments.${err.message}`),
      })

      return
    }

    await refreshPublication()
  }, [
    commentId,
    likePublicationCommentService,
    refreshPublication,
    publicationId,
    t,
    toast,
  ])

  const handleDeleteComment = useCallback(async () => {
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
        description: t(`errors:users.publications.comments.${err.message}`),
      })

      return
    }

    await refreshPublication()
    handleShowDeleteCommentDialog()
  }, [
    commentId,
    deletePublicationCommentService,
    handleShowDeleteCommentDialog,
    refreshPublication,
    publicationId,
    t,
    toast,
  ])

  return (
    <>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger className="cursor-default text-left">
            {children}
          </TooltipTrigger>

          <TooltipContent
            side="top"
            className={`bg-accent-500 mb-[-20px] flex flex-row gap-2 ${isDescription ? "hidden" : ""}`}
          >
            <HeartIcon
              title={t("publication-modal:icons.like-title")}
              className={`text-accent-500 size-6 cursor-pointer stroke-white stroke-[1.5] duration-200 ${isLiked ? "animate-jump fill-white" : ""}`}
              onClick={handleLikeComment}
            />

            {replyCommentButton}

            {deleteCommentButton}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AlertPopup
        type="danger"
        open={showDeleteCommentDialog}
        onClose={handleShowDeleteCommentDialog}
        onConfirm={handleDeleteComment}
        titleKey={t("publication-modal:delete-comment-modal.title")}
        descriptionKey={t("publication-modal:delete-comment-modal.description")}
        cancelKey={t("publication-modal:delete-comment-modal.cancel")}
        confirmKey={t("publication-modal:delete-comment-modal.confirm")}
      />
    </>
  )
}

export default CommentWithActions
