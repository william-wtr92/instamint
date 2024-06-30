import { PaperAirplaneIcon } from "@heroicons/react/24/outline"
import { zodResolver } from "@hookform/resolvers/zod"
import { type ChatMessage, chatMessageSchema } from "@instamint/shared-types"
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  Input,
} from "@instamint/ui-kit"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useCallback } from "react"
import { useForm } from "react-hook-form"

import { MessagesBox } from "@/web/components/users/messages/MessagesBox"
import useAppContext from "@/web/contexts/useAppContext"
import getTranslationBaseImports from "@/web/utils/helpers/getTranslationBaseImports"

type MessagesPageProps = {
  roomName: string | null
}

export const getServerSideProps: GetServerSideProps<MessagesPageProps> = async (
  context
) => {
  const { params, locale } = context

  const roomName = params?.id as string

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        ...getTranslationBaseImports(),
        "message",
      ])),
      roomName,
    },
  }
}

const MessagesPage = (
  _props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { roomName } = _props

  const {
    socket: { chatMessage },
  } = useAppContext()

  const { t } = useTranslation("message")

  const form = useForm<Omit<ChatMessage, "room">>({
    resolver: zodResolver(chatMessageSchema.omit({ room: true })),
    mode: "onBlur",
    defaultValues: {
      message: "",
    },
  })

  const onSubmit = useCallback(
    (values: Omit<ChatMessage, "room">) => {
      if (roomName === null) {
        return
      }

      chatMessage({ message: values.message, room: roomName! })

      form.setValue("message", "")
    },
    [roomName, chatMessage, form]
  )

  return (
    <MessagesBox roomName={roomName!}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center justify-center gap-2.5"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="w-3/4">
                <FormControl>
                  <Input
                    className="focus-visible:outline-accent-500  px-4 py-1.5 focus-visible:border-0 focus-visible:ring-0"
                    type="text"
                    placeholder={t("chat.placeholder")}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            disabled={!form.formState.isValid}
            className={`bg-accent-500 py-2 font-semibold text-white ${!form.formState.isValid ? "cursor-not-allowed opacity-50" : "hover:cursor-pointer"}`}
            type="submit"
          >
            <PaperAirplaneIcon className="size-6" />
          </Button>
        </form>
      </Form>
    </MessagesBox>
  )
}

MessagesPage.title = "messages"

export default MessagesPage
