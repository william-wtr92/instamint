import type { Comment, Publication } from "@instamint/shared-types"
import { DialogContent } from "@instamint/ui-kit"
import Image from "next/image"
import { useTranslation } from "next-i18next"
import React, { useCallback, useState } from "react"

import PublicationCommentRow from "@/web/components/publications/PublicationCommentRow"
import PublicationModalContentActions from "@/web/components/publications/PublicationModalContentActions"
import PublicationModalContentHeader from "@/web/components/publications/PublicationModalContentHeader"
import { config } from "@/web/config"
import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useGetPublicationById } from "@/web/hooks/publications/useGetPublicationById"
import { useUserByUsername } from "@/web/hooks/users/useUserByUsername"
import { firstLetter } from "@/web/utils/helpers/stringHelper"

type Props = {
  publication: Publication
}

const PublicationModalContent = (props: Props) => {
  const { publication } = props

  const { t } = useTranslation("profile")

  const {
    services: {
      users: { replyPublicationCommentService },
    },
    publicationId,
  } = useAppContext()

  const { toast } = useActionsContext()

  const { mutate } = useGetPublicationById(publicationId)

  const { data, isLoading } = useUserByUsername({
    username: publication.author,
  })
  const user = isLoading ? null : data
  const usernameFirstLetter = firstLetter(publication.author)
  const publicationAuthorAvatar = user?.avatar
    ? `${config.api.blobUrl}${user.avatar}`
    : null

  const [showComments, setShowComments] = useState<boolean>(false)
  const [replyCommentId, setReplyCommentId] = useState<number | null>(null)
  const [replyCommentUsername, setReplyCommentUsername] = useState<
    string | null
  >(null)

  const handleShowComments = useCallback(() => {
    setShowComments((prevState) => !prevState)
  }, [])

  const handleReplyCommentId = useCallback((replyCommentId: number | null) => {
    setReplyCommentId(replyCommentId)
  }, [])

  const replyToComment = useCallback(
    async (commentId: number, publicationId: number, content: string) => {
      if (!commentId || !publicationId) {
        return
      }

      const [err] = await replyPublicationCommentService({
        commentId: commentId.toString(),
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
      setReplyCommentId(null)
    },
    [mutate, replyPublicationCommentService, t, toast]
  )

  return (
    <DialogContent
      variant="fit"
      className="block h-[90vh] w-[90vw] overflow-hidden rounded-sm border-0 bg-white p-0 md:flex md:h-[70vh] md:w-[95vw] md:flex-row md:gap-0 lg:h-[80vh] lg:w-fit lg:max-w-[80vw]"
    >
      <div className="border-b-1 relative hidden aspect-square duration-300 md:mt-0 md:block md:border-0">
        <Image
          src={config.api.blobUrl + publication.image}
          alt={"Publication " + publication.id}
          fill
          className="size-full object-contain"
        />
      </div>

      <div className="md:border-l-1 flex h-full flex-col md:w-[calc(95vw-70vh)] lg:w-[calc(80vw-80vh)]">
        <PublicationModalContentHeader
          username={publication.author}
          userAvatar={publicationAuthorAvatar}
          usernameFirstLetter={usernameFirstLetter}
          location={publication.location}
        />
        {/* Displayed on mobile / Hidden on tablets and bigger */}
        <div
          className={`relative mx-auto block aspect-square overflow-hidden rounded-sm duration-300 md:hidden ${showComments ? "h-0" : "h-[40%]"}`}
        >
          <Image
            src={config.api.blobUrl + publication.image}
            alt={`Publication ${publication.id}`}
            fill
            className="size-full object-contain"
          />
        </div>

        <div
          className={`border-t-1 w-full flex-1 overflow-x-hidden overflow-y-scroll duration-300 md:h-[70%] md:flex-initial md:border-0 ${showComments ? "border-transparent" : "border-neutral-300"}`}
        >
          {/* This component is used here for the publication description as the design is almost the same */}
          <PublicationCommentRow
            avatar={publicationAuthorAvatar}
            commentAuthorUsername={publication.author}
            content={publication.description}
            hashtags={JSON.parse(publication.hashtags)}
            isDescription={true}
          />

          <span id="comments-top-anchor"></span>

          {publication.comments.map((comment: Comment, index: number) => (
            <PublicationCommentRow
              key={index}
              avatar={
                comment.user.avatar
                  ? `${config.api.blobUrl}${comment.user.avatar}`
                  : null
              }
              content={comment.content}
              publicationAuthorId={publication.userId}
              commentAuthor={comment.user}
              commentAuthorUsername={comment.user.username}
              commentId={comment.id}
              commentParentId={comment.parentId}
              commentReplies={comment.replies}
              handleReplyCommentId={handleReplyCommentId}
              setReplyCommentUsername={setReplyCommentUsername}
            />
          ))}
        </div>

        <PublicationModalContentActions
          publication={publication}
          replyCommentId={replyCommentId}
          replyCommentUsername={replyCommentUsername}
          handleShowComments={handleShowComments}
          replyToComment={replyToComment}
          handleReplyCommentId={handleReplyCommentId}
        />
      </div>
    </DialogContent>
  )
}

export default PublicationModalContent
