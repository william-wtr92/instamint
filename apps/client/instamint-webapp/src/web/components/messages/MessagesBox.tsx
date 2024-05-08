import { UserIcon } from "@heroicons/react/24/outline"
import { useCallback, useEffect, useRef, useState } from "react"

import { useUser } from "@/web/hooks/auth/useUser"
import { useMessage } from "@/web/hooks/messages/useMessage"

type Props = {
  roomName: string | null
  children: React.ReactNode
}

export const MessagesBox = (props: Props) => {
  const { roomName, children } = props

  const { data } = useUser()
  const { messages, userTargeted, isLoading, setSize, isReachingEnd } =
    useMessage(roomName!)

  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true)

  const userTargetedUsername = userTargeted?.username.replace(/^\w/, (c) =>
    c.toUpperCase()
  )

  const sortedMessages = messages.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

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
  }, [messages, isAtBottom])

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    scrollContainer?.addEventListener("scroll", handleScroll)

    return () => {
      scrollContainer?.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  return (
    <div className="p-text-large-screen flex h-[60vh] flex-col gap-6 xl:h-screen">
      <div className="flex items-center gap-2.5">
        <UserIcon className="h-6 w-6" />
        <h1 className="text-body">{userTargetedUsername}</h1>
      </div>
      <div
        className="p-text-large-screen border-1 scrollbar-thin scrollbar-thumb-accent-400 scrollbar-track-neutral-100 flex h-[85%] flex-col gap-3 overflow-y-auto rounded-md"
        ref={scrollContainerRef}
      >
        {sortedMessages.map((message) => (
          <div
            key={message?.id}
            className={`text-medium p-body max-w-2xl rounded-lg  ${
              message?.userId === data?.id
                ? "bg-accent-400 ml-auto text-white"
                : " mr-auto bg-neutral-50"
            }`}
          >
            {message?.content}
          </div>
        ))}
        {isLoading && <p>Loading...</p>}
      </div>
      <div>{children}</div>
    </div>
  )
}
