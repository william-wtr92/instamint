import type { GetServerSideProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import React, { type ReactElement, useEffect, useCallback } from "react"
import { useTranslation } from "next-i18next"
import { userInfosSchema, type UserInfosSchema } from "@instamint/shared-types"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  Textarea,
} from "@instamint/ui-kit"

import getTranslationBaseImports from "@/web/utils/helpers/getTranslationBaseImports"
import SettingsLayout from "@/web/components/layout/SettingsLayout"
import useAppContext from "@/web/contexts/useAppContext"
import useActionsContext from "@/web/contexts/useActionsContext"
import { useUser } from "@/web/hooks/auth/useUser"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        ...getTranslationBaseImports(),
        "profile-settings-edit",
      ])),
    },
  }
}

const ProfileSettingsEditPage = () => {
  const { t } = useTranslation()
  const {
    services: {
      users: { updateUserInfos },
    },
  } = useAppContext()
  const { toast } = useActionsContext()
  const { data, isLoading } = useUser()
  const user = isLoading ? null : data

  const onSubmit = useCallback(
    async (values: UserInfosSchema) => {
      const [err] = await updateUserInfos(values)

      if (err) {
        toast({
          variant: "error",
          description: t(
            `errors:users.profile-settings.update-account.${err.message}`
          ),
        })

        return
      }

      toast({
        variant: "success",
        description: t("profile-settings-edit:update-account.success"),
      })
    },
    [updateUserInfos, toast, t]
  )

  const form = useForm<UserInfosSchema>({
    resolver: zodResolver(userInfosSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      bio: "",
      link: "",
    },
  })

  const {
    formState: { errors },
  } = form

  useEffect(() => {
    form.setValue("username", user?.username)
    form.setValue("bio", user?.bio)
    form.setValue("link", user?.link)
  }, [form, user])

  return (
    <>
      {user && (
        <div className="flex flex-col p-4">
          <p className="p-4">{t("profile-settings-edit:update-account.p1")}</p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-text-large-screen flex w-full flex-col items-center space-y-8"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="relative left-1 font-bold">
                      {t("profile-settings-edit:update-account.username.label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="focus-visible:outline-accent-500 mt-2 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                        placeholder={t(
                          "profile-settings-edit:update-account.username.placeholder"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage
                      className="text-error-primary relative left-2"
                      useCustomError={true}
                    >
                      {errors.username ? (
                        <span>
                          {t(
                            "profile-settings-edit:update-account.username.error"
                          )}
                        </span>
                      ) : null}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="relative left-1 font-bold">
                      {t("profile-settings-edit:update-account.bio.label")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="focus-visible:outline-accent-500 mt-2 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                        placeholder={t(
                          "profile-settings-edit:update-account.bio.placeholder"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage
                      className="text-error-primary relative left-2"
                      useCustomError={true}
                    >
                      {errors.username ? (
                        <span>
                          {t("profile-settings-edit:update-account.bio.error")}
                        </span>
                      ) : null}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="relative left-1 font-bold">
                      {t("profile-settings-edit:update-account.link.label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="focus-visible:outline-accent-500 mt-2 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                        placeholder={t(
                          "profile-settings-edit:update-account.link.placeholder"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage
                      className="text-error-primary relative left-2"
                      useCustomError={true}
                    >
                      {errors.username ? (
                        <span>
                          {t("profile-settings-edit:update-account.link.error")}
                        </span>
                      ) : null}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <Button
                className={`bg-accent-500 w-1/2 py-2.5 font-semibold text-white`}
                type="submit"
              >
                {t("profile-settings-edit:update-account.save")}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </>
  )
}
ProfileSettingsEditPage.title = "profile.settings.edit"

ProfileSettingsEditPage.getLayout = (page: ReactElement) => {
  return <SettingsLayout>{page}</SettingsLayout>
}

export default ProfileSettingsEditPage
