import type { GetMessages } from "@instamint/shared-types"
import { type SWRConfiguration } from "swr"
import useSWRInfinite from "swr/infinite"

import type { Message, UserTargeted } from "@/types"
import { routes } from "@/web/routes"

type MessagesData = {
  result: {
    messages: {
      sent: Message[]
      received: Message[]
    }
    userTargeted: UserTargeted
  }
}

type SWRInfiniteResponse = {
  messages: Message[]
  userTargeted: UserTargeted | null
  isLoading: boolean
  isError: boolean
  isReachingEnd: boolean
  size: number
  setSize: (size: number | ((size: number) => number)) => void
}

const getKey = (
  pageIndex: number,
  previousPageData: MessagesData | null,
  roomName: string
) => {
  if (
    previousPageData &&
    previousPageData.result.messages.sent.length === 0 &&
    previousPageData.result.messages.received.length === 0
  ) {
    return null
  }

  const numberOfMessagesPerPage = 20
  const offset = pageIndex * numberOfMessagesPerPage

  return routes.api.messages.getMessages({
    roomName,
    offset: offset.toString(),
  })
}

export const useMessage = (
  getMessages: Pick<GetMessages, "roomName">
): SWRInfiniteResponse => {
  const config: SWRConfiguration = {
    revalidateOnFocus: false,
    refreshInterval: 1000,
    revalidateOnReconnect: true,
  }

  const { data, error, size, setSize, isValidating } = useSWRInfinite<
    MessagesData,
    Error
  >(
    (pageIndex, previousPageData) =>
      getKey(pageIndex, previousPageData, getMessages.roomName),
    config
  )

  const isLoading = !data && !error && isValidating
  const isError = !!error

  const isReachingEnd = data
    ? data[data.length - 1].result.messages.sent.length === 0 &&
      data[data.length - 1].result.messages.received.length === 0
    : false

  const allMessages: Message[] = []
  const uniqueMessageIDs = new Set<number>()

  if (data) {
    data.forEach((page) => {
      ;[...page.result.messages.sent, ...page.result.messages.received].forEach(
        (message) => {
          if (!uniqueMessageIDs.has(message.id)) {
            uniqueMessageIDs.add(message.id)
            allMessages.push(message)
          }
        }
      )
    })
  }

  const userTargeted = data ? data[0].result.userTargeted : null

  return {
    messages: allMessages,
    userTargeted,
    isLoading,
    isError,
    isReachingEnd,
    size,
    setSize,
  }
}
