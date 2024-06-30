import { zodResolver } from "@hookform/resolvers/zod"
import { userInfosSchema, type UserInfos } from "@instamint/shared-types"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
  Label,
} from "@instamint/ui-kit"
import type { GetServerSideProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import React, { useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"

import SettingsPageContainer from "@/web/components/layout/SettingsPageContainer"
import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useUser } from "@/web/hooks/auth/useUser"
import countries from "@/web/utils/countries.json"
import getTranslationBaseImports from "@/web/utils/helpers/getTranslationBaseImports"
import getSettingsLayout from "@/web/utils/layout/getSettingsLayout"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        ...getTranslationBaseImports(),
        "profile-settings-edit",
        "countries",
      ])),
    },
  }
}

const ProfileSettingsEditPage = () => {
  const { t } = useTranslation()
  const {
    services: {
      users: { updateUserInfos, uploadAvatar },
    },
  } = useAppContext()
  const { toast } = useActionsContext()
  const { data, isLoading } = useUser()
  const user = isLoading ? null : data

  const onSubmit = useCallback(
    async (values: UserInfos) => {
      const [errInfos] = await updateUserInfos({
        username: values.username ? values.username : "",
        bio: values.bio ? values.bio : "",
        link: values.link ? values.link : "",
        location: values.location ? values.location : "",
      })

      if (errInfos) {
        toast({
          variant: "error",
          description: t(
            `errors:users.profile-settings.update-account.${errInfos.message}`
          ),
        })

        return
      }

      if (values.avatar !== undefined) {
        const [errAvatar] = await uploadAvatar({ avatar: values.avatar })

        if (errAvatar) {
          toast({
            variant: "error",
            description: t(
              `errors:users.profile-settings.update-account.avatar.${errAvatar.message}`
            ),
          })

          return
        }
      }

      toast({
        variant: "success",
        description: t("profile-settings-edit:update-account.success"),
      })
    },
    [updateUserInfos, uploadAvatar, toast, t]
  )

  const form = useForm<UserInfos>({
    resolver: zodResolver(userInfosSchema),
    mode: "onBlur",
    defaultValues: {
      username: user?.username ?? "",
      bio: user?.bio ?? "",
      link: user?.link ?? "",
      location: user?.location ?? "",
      avatar: undefined,
    },
  })

  const {
    formState: { errors },
  } = form

  useEffect(() => {
    form.setValue("username", user?.username || "")
    form.setValue("bio", user?.bio || "")
    form.setValue("link", user?.link || "")
    form.setValue("location", user?.location || "")
  }, [form, user])

  const handleClearAvatar = useCallback(() => {
    form.setValue("avatar", undefined)
  }, [form])

  return (
    <>
      {user && (
        <SettingsPageContainer>
          <Text
            type={"medium"}
            variant={"neutral"}
            className="border-1 ml-6 flex w-[80%] items-center gap-2 rounded-md border-neutral-600 px-2 py-3"
          >
            <span className="flex size-6 items-center justify-center rounded-2xl border-2 border-dashed border-neutral-600 px-2">
              {t("profile-settings-edit:update-account.i")}
            </span>
            <span>{t("profile-settings-edit:update-account.p1")}</span>
          </Text>
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
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="relative left-1 font-bold">
                      {t("profile-settings-edit:update-account.location.label")}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-[250px]">
                          <SelectValue
                            placeholder={t(
                              "profile-settings-edit:update-account.location.placeholder"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white" position={"popper"}>
                        {countries.map((country, index) => (
                          <SelectItem key={index} value={country.name}>
                            {t(`countries:${country.name}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage
                      className="text-error-primary relative left-2"
                      useCustomError={true}
                    >
                      {errors.username ? (
                        <span>
                          {t(
                            "profile-settings-edit:update-account.location.error"
                          )}
                        </span>
                      ) : null}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avatar"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem className="w-full">
                    <FormLabel
                      className="relative left-1 font-bold"
                      htmlFor={"avatar"}
                    >
                      {t("profile-settings-edit:update-account.avatar.label")}
                    </FormLabel>
                    <FormControl>
                      <div>
                        <Input
                          {...fieldProps}
                          id={"avatar"}
                          type={"file"}
                          className="hidden"
                          placeholder={t(
                            "profile-settings-edit:update-account.avatar.placeholder"
                          )}
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={(event) =>
                            onChange(
                              event.target.files && event.target.files[0]
                            )
                          }
                        />
                        <div className="relative left-1.5 mt-4 flex items-center gap-3">
                          <Label
                            htmlFor={"avatar"}
                            className="rounded-md p-3 outline-dashed outline-2 hover:cursor-pointer"
                          >
                            {t(
                              "profile-settings-edit:update-account.avatar.placeholder"
                            )}
                          </Label>
                          <span>{value ? value.name : ""} </span>
                          {value && (
                            <span
                              onClick={handleClearAvatar}
                              className="hover:cursor-pointer"
                            >
                              {t(
                                "profile-settings-edit:update-account.avatar.delete"
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage
                      className="text-error-primary relative left-2"
                      useCustomError={true}
                    >
                      {errors.avatar ? (
                        <span>
                          {t(
                            "profile-settings-edit:update-account.avatar.error"
                          )}
                        </span>
                      ) : null}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <Button
                className={`bg-accent-500 w-1/4 py-2.5 font-semibold text-white`}
                type="submit"
              >
                {t("profile-settings-edit:update-account.save")}
              </Button>
            </form>
          </Form>
        </SettingsPageContainer>
      )}
    </>
  )
}
ProfileSettingsEditPage.title = "profile.settings.edit"

ProfileSettingsEditPage.getLayout = getSettingsLayout

export default ProfileSettingsEditPage
