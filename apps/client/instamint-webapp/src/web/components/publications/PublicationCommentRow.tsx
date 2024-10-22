import type { CommentUser, SubComment } from "@instamint/shared-types"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  Text,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@instamint/ui-kit"
import Link from "next/link"
import { useTranslation } from "next-i18next"
import React, { useCallback, useMemo, useState } from "react"

import CommentWithActions from "@/web/components/publications/CommentWithActions"
import { config } from "@/web/config"
import { routes } from "@/web/routes"
import { firstLetter } from "@/web/utils/helpers/stringHelper"

type Props = {
  avatar: string | null
  commentAuthorUsername: string
  content: string
  hashtags?: string[]
  isDescription?: boolean

  publicationAuthorId?: number
  commentAuthor?: CommentUser
  commentId?: number
  commentParentId?: number | null
  commentReplies?: SubComment[]
  isLiked?: boolean
  likes?: number
  handleReplyCommentId?: (commentId: number) => void
  setReplyCommentUsername?: (username: string) => void
}

const PublicationCommentRow = (props: Props) => {
  const {
    avatar,
    content,
    commentAuthorUsername,
    hashtags,
    isDescription,

    commentAuthor,
    commentId,
    commentParentId,
    commentReplies,
    publicationAuthorId,
    isLiked,
    likes,
    handleReplyCommentId,
    setReplyCommentUsername,
  } = props
  const { t } = useTranslation("profile")

  const usernameFirstLetter = firstLetter(commentAuthorUsername)

  const [showCommentReplies, setShowCommentReplies] = useState<boolean>(false)

  const handleShowCommentReplies = useCallback(() => {
    setShowCommentReplies((prevState) => !prevState)
  }, [])

  const handleReplyCommentUser = useCallback(() => {
    const commentInput = document.getElementById(
      "comment-input"
    ) as HTMLInputElement

    if (!handleReplyCommentId || !setReplyCommentUsername) {
      return
    }

    commentInput.focus()

    handleReplyCommentId(commentId!)
    setReplyCommentUsername(commentAuthorUsername)
  }, [
    commentId,
    handleReplyCommentId,
    setReplyCommentUsername,
    commentAuthorUsername,
  ])

  const hashtagsList = useMemo(() => {
    if (hashtags && hashtags.length > 0) {
      return (
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
      )
    }
  }, [hashtags])

  const commentRepliesCollapsible = useMemo(() => {
    if (commentReplies && commentReplies.length > 0) {
      return (
        <Collapsible
          open={showCommentReplies}
          onOpenChange={handleShowCommentReplies}
        >
          <CollapsibleTrigger className="h-fit">
            <Text
              type={"small"}
              variant={"none"}
              className="text-[0.7rem] font-light"
            >
              {showCommentReplies
                ? t("publication-modal:hide-replies")
                : t("publication-modal:show-replies", {
                    repliesCount: commentReplies.length,
                  })}
            </Text>
          </CollapsibleTrigger>

          <CollapsibleContent
            className={`flex flex-col gap-2 ${showCommentReplies ? "pt-2" : "pt-0"}`}
          >
            {commentReplies.map((commentReply, index) => {
              const replyUsernameFirstLetter = commentReply.user.username[0]
              const replyUserAvatar = commentReply.user.avatar
                ? `${config.api.blobUrl}${commentReply.user.avatar}`
                : ""

              const replyLikes = commentReply.likes.length
              const isReplyLiked = commentReply.likes.some(
                (like) => like.id === commentReply.user.id
              )

              return (
                <CommentWithActions
                  key={index}
                  commentId={commentReply.id}
                  commentAuthor={commentReply.user}
                  commentParentId={commentReply.parentId}
                  publicationAuthorId={publicationAuthorId}
                  handleReplyCommentUser={handleReplyCommentUser}
                  isLiked={isReplyLiked}
                >
                  <div key={index} className="flex flex-row gap-2">
                    <Avatar className="border-accent-500 size-8 cursor-pointer border">
                      {commentReply.user.avatar ? (
                        <AvatarImage
                          src={replyUserAvatar}
                          alt={commentAuthorUsername}
                        />
                      ) : (
                        <AvatarFallback>
                          {replyUsernameFirstLetter}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className="w-[calc(90vw-96px)] md:w-[calc(95vw-70vh-96px)] lg:w-[calc(80vw-80vh-96px)]">
                      <Text
                        type="medium"
                        variant="none"
                        className="break-words"
                      >
                        <Link
                          href={routes.client.profile.getProfile(
                            commentReply.user.username
                          )}
                          className="float-left mr-1.5 font-bold"
                        >
                          {commentReply.user.username}
                        </Link>

                        <span className="font-normal">
                          {commentReply.content}
                        </span>
                      </Text>

                      <Text
                        type="small"
                        variant={isReplyLiked ? "accent" : "neutral"}
                        className="mt-2"
                      >
                        {replyLikes} {t("publication-modal:likes")}
                      </Text>
                    </div>
                  </div>
                </CommentWithActions>
              )
            })}
          </CollapsibleContent>
        </Collapsible>
      )
    }
  }, [
    commentAuthorUsername,
    commentReplies,
    handleReplyCommentUser,
    handleShowCommentReplies,
    publicationAuthorId,
    showCommentReplies,
    t,
  ])

  return (
    <>
      <CommentWithActions
        commentId={commentId}
        commentAuthor={commentAuthor}
        commentParentId={commentParentId}
        publicationAuthorId={publicationAuthorId}
        handleReplyCommentUser={handleReplyCommentUser}
        isLiked={isLiked}
        isDescription={isDescription}
      >
        <div
          className={`flex flex-row items-start gap-2 duration-200 ${isDescription ? "border-b-1 border-neutral-200" : ""} p-2`}
        >
          <Avatar className="border-accent-500 size-8 cursor-pointer border">
            {avatar ? (
              <AvatarImage src={avatar} alt={commentAuthorUsername} />
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
              className="max-w-full break-words"
            >
              <Link
                href={routes.client.profile.getProfile(commentAuthorUsername!)}
                className="float-left mr-1.5 font-bold"
              >
                {commentAuthorUsername}
              </Link>

              <span className="font-normal">{content}</span>
            </Text>

            {hashtagsList}

            {!isDescription && (
              <Text
                type="small"
                variant={isLiked ? "accent" : "neutral"}
                className="mt-2"
              >
                {likes} {t("publication-modal:likes")}
              </Text>
            )}

            {commentRepliesCollapsible}
          </div>
        </div>
      </CommentWithActions>
    </>
  )
}

export default PublicationCommentRow
