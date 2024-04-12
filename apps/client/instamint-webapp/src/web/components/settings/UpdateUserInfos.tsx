import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useTranslation } from "next-i18next"

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
} from "@instamint/ui-kit"
import { userInfosSchema, type UserInfosSchema } from "@instamint/shared-types"

export const UpdateUserInfos = (props: UpdateUserInfosProps) => {
  const { settingsRequired, user, onSubmit, error, success } = props
  const { t } = useTranslation()

  const form = useForm<UserInfosSchema>({
    resolver: zodResolver(userInfosSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      email: "",
    },
  })

  useEffect(() => {
    if (user) {
      form.setValue("username", user?.username)
      form.setValue("email", user.email)
    }
  }, [form, user])

  const {
    formState: { errors },
  } = form

  return (
    <>
      {settingsRequired === "username-settings" && (
        <div className="grid grow w-60 h-60">
          <p className="p-4">
            {t("profile-settings:update-account.username.p1")}
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex items-center flex-col p-text-large-screen space-y-8"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="relative left-1 font-bold">
                      {t("profile-settings:update-account.username.label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="mt-2 py-2 px-4 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-accent-500"
                        placeholder={t(
                          "profile-settings:update-account.username.placeholder"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage
                      className="relative left-2 text-error-primary"
                      useCustomError={true}
                    >
                      {errors.username ? (
                        <span>
                          {t("profile-settings:update-account.username.error")}
                        </span>
                      ) : null}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <Button
                className={`bg-accent-500 text-white font-semibold py-2.5 w-1/2`}
                type="submit"
              >
                {t("profile-settings:update-account.save")}
              </Button>
              {success ? (
                <p className="mt-4 text-sm text-center text-accent-600">
                  {success}
                </p>
              ) : null}
              {error ? (
                <p className="mt-4 text-md text-center text-error-primary">
                  {error instanceof Error ? error.message : error}
                </p>
              ) : null}
            </form>
          </Form>
        </div>
      )}
    </>
  )
}

export type UpdateUserInfosProps = {
  settingsRequired: string
  user: UserInfosSchema | undefined | null
  onSubmit: (values: UserInfosSchema) => Promise<void>
  error: string | Error | null
  success: string | null
}
