import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "next-i18next"
import { userInfosSchema, type UserInfosSchema } from "@instamint/shared-types"

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

type UpdateUserInfosProps = {
  settingsRequired: string
  user: UserInfosSchema | undefined | null
  onSubmit: (values: UserInfosSchema) => Promise<void>
  error: string | Error | null
  success: string | null
}

export const UpdateUserInfos = (props: UpdateUserInfosProps) => {
  const { settingsRequired, user, onSubmit, error, success } = props
  const { t } = useTranslation()

  const form = useForm<UserInfosSchema>({
    resolver: zodResolver(userInfosSchema),
    mode: "onBlur",
    defaultValues: {
      username: user?.username,
      email: user?.email,
    },
  })

  const {
    formState: { errors },
  } = form

  return (
    <>
      {settingsRequired === "username-settings" && (
        <div className="grid h-60 w-60 grow">
          <p className="p-4">
            {t("profile-settings:update-account.username.p1")}
          </p>
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
                      {t("profile-settings:update-account.username.label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="focus-visible:outline-accent-500 mt-2 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                        placeholder={t(
                          "profile-settings:update-account.username.placeholder"
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
                          {t("profile-settings:update-account.username.error")}
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
                {t("profile-settings:update-account.save")}
              </Button>
              {success ? (
                <p className="text-accent-600 mt-4 text-center text-sm">
                  {success}
                </p>
              ) : null}
              {error ? (
                <p className="text-md text-error-primary mt-4 text-center">
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
