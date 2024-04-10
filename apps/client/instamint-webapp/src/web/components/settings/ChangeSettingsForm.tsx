import type { ChangeSettingsFormProps } from "@/types"
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
} from "@instamint/ui-kit"
import {
  usernameEmailSettingsSchema,
  type UsernameEmailSettingsSchema,
} from "@instamint/shared-types"
import { useEffect } from "react"
import { useTranslation } from "next-i18next"

export const ChangeSettingsForm = (props: ChangeSettingsFormProps) => {
  const { settingsRequired, user, onSubmit } = props
  const { t } = useTranslation()

  const form = useForm<UsernameEmailSettingsSchema>({
    resolver: zodResolver(usernameEmailSettingsSchema),
    mode: "onBlur",
    defaultValues: {
      id: 0,
      username: "",
      email: "",
    },
  })

  useEffect(() => {
    if (user) {
      form.setValue("id", user.id || 0)
      form.setValue("username", user.username || "")
      form.setValue("email", user.email || "")
    }
  }, [form, user])

  const {
    formState: { errors },
  } = form

  if (settingsRequired === "username") {
    return (
      <div>
        <p className="p-4">{t("profile-settings:username-email.p1")}</p>
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
                    {t("sign-up:username.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-accent-500"
                      placeholder={t("sign-up:username.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className="relative left-2 text-error-primary"
                    useCustomError={true}
                  >
                    {errors.username ? (
                      <span>{t("sign-up:username.error")}</span>
                    ) : null}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="relative left-1 font-bold">
                    {t("sign-up:email.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-accent-500"
                      type="email"
                      placeholder={t("sign-up:email.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className="relative left-2 text-error-primary"
                    useCustomError={true}
                  >
                    {errors.email ? (
                      <span>{t("sign-up:email.error")}</span>
                    ) : null}
                  </FormMessage>
                </FormItem>
              )}
            />
            <Button
              className={`bg-accent-500 text-white font-semibold py-2.5 w-1/2`}
              type="submit"
            >
              {t("common:cta.save")}
            </Button>
          </form>
        </Form>
      </div>
    )
  } else if (settingsRequired === "bio") {
    return <div>TO DO FOR TICKET 27</div>
  } else if (settingsRequired === "link") {
    return <div>TO DO FOR TICKET 28</div>
  } else if (settingsRequired === "picture") {
    return <div>TO DO FOR TICKET 26</div>
  }
}
