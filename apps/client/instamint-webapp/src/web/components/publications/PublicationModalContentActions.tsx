import { ChatBubbleOvalLeftIcon, XMarkIcon } from "@heroicons/react/24/solid"
import type { Publication } from "@instamint/shared-types"
import { Button, Input, Text } from "@instamint/ui-kit"
import { useRouter } from "next/router"
import { useTranslation } from "next-i18next"
import React, { useCallback, useEffect, useRef } from "react"

import LikeButton from "@/web/components/publications/LikeButton"
import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useUser } from "@/web/hooks/auth/useUser"
import { useGetPublicationById } from "@/web/hooks/publications/useGetPublicationById"
import { dateIntoString, formatDate } from "@/web/utils/helpers/dateHelper"

type Props = {
  publication: Publication
  replyCommentId: number | null
  replyCommentUsername: string | null
  handleShowComments: () => void
  replyToComment: (
    commentId: number,
    publicationId: number,
    content: string
  ) => Promise<void>
  handleReplyCommentId: (commentId: number | null) => void
}

const PublicationModalContentActions = (props: Props) => {
  const {
    publication,
    replyCommentId,
    replyCommentUsername,
    handleShowComments,
    replyToComment,
    handleReplyCommentId,
  } = props

  const { t } = useTranslation("profile")
  const { locale } = useRouter()

  const inputRef = useRef<HTMLInputElement | null>(null)

  const {
    services: {
      users: { addPublicationCommentService },
    },
    publicationId,
  } = useAppContext()
  const { toast } = useActionsContext()

  const { mutate } = useGetPublicationById(publicationId)

  const { data, isLoading } = useUser()
  const user = isLoading ? null : data

  const sendComment = useCallback(async () => {
    if (!user || !inputRef.current || !publicationId) {
      return
    }

    const input = inputRef.current

    const topAnchor = document.getElementById("comments-top-anchor")
    const content = input.value

    const [err] = await addPublicationCommentService({
      publicationId: publicationId.toString(),
      content,
    })

    if (err) {
      toast({
        variant: "error",
        description: t(`errors.publications.${err.message}`),
      })

      return
    }

    await mutate()
    input.value = ""
    topAnchor?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [addPublicationCommentService, mutate, publicationId, t, toast, user])

  const handleReplyToComment = useCallback(async () => {
    if (!replyCommentId || !inputRef.current || !publicationId) {
      return
    }

    const input = inputRef.current

    const topAnchor = document.getElementById("comments-top-anchor")
    const content = input.value

    await replyToComment(replyCommentId, publicationId, content)

    input.value = ""
    topAnchor?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [publicationId, replyCommentId, replyToComment])

  useEffect(() => {
    if (!inputRef.current) {
      return
    }

    const input = inputRef.current

    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault()

        replyCommentId !== null
          ? await handleReplyToComment()
          : await sendComment()
      }
    }

    input.addEventListener("keydown", handleKeyDown)

    return () => {
      input.removeEventListener("keydown", handleKeyDown)
    }
  }, [
    handleReplyToComment,
    publication.id,
    replyCommentId,
    replyToComment,
    sendComment,
  ])

  return (
    <div className="border-t-1 flex w-full flex-col justify-between border-neutral-300 p-2 md:flex-1">
      <div className="flex flex-row items-start justify-start gap-2">
        <LikeButton isLiked={publication.isLiked} />

        <ChatBubbleOvalLeftIcon
          title={t("publication-modal.icons.comment-title")}
          className="hidden size-8 stroke-black stroke-1 text-neutral-100 md:block"
        />

        <ChatBubbleOvalLeftIcon
          title={t("publication-modal.icons.comment-title")}
          className="size-8 stroke-black stroke-1 text-neutral-100 md:hidden"
          onClick={handleShowComments}
        />
      </div>

      <div
        className={`flex h-fit max-h-full flex-1 flex-col justify-between gap-2 py-1 pl-1 md:py-2`}
      >
        <Text type="medium" variant="none">
          {publication.likes.length} {t("publication-modal.likes")}
        </Text>

        <Text type="small" variant="none">
          {dateIntoString(formatDate(publication.createdAt), locale!)}
        </Text>
      </div>

      <div className={`relative flex flex-row gap-2`}>
        <Text
          type="medium"
          variant="none"
          className={`group/reply-username bg-accent-500 absolute left-1 z-10 flex h-fit w-fit flex-row items-center rounded-t-sm p-1 text-white duration-200 ${replyCommentId ? "translate-y-[calc(-100%)]" : ""}`}
        >
          <XMarkIcon
            className="hidden size-4 group-hover/reply-username:block"
            onClick={() => handleReplyCommentId(null)}
          />

          <span>
            {t("publication-modal.reply-comment-placeholder", {
              username: replyCommentUsername,
            })}
          </span>
        </Text>

        <Input
          ref={inputRef}
          id="comment-input"
          type="text"
          maxLength={255}
          className="z-20 border-0 outline-offset-0"
          placeholder={t("publication-modal.add-comment-placeholder")}
        />

        <Button onClick={sendComment}>{t("cta.send")}</Button>
      </div>
    </div>
  )
}

export default PublicationModalContentActions
