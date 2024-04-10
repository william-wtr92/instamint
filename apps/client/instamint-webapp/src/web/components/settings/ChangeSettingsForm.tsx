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

export const ChangeSettingsForm = (props: ChangeSettingsFormProps) => {
  const { settingsRequired, translation, user, onSubmit } = props

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
        <p className="p-4">
          {translation("settings:label-set-username-email")}
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
                    {translation("sign-up:username.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-accent-500"
                      placeholder={translation("sign-up:username.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className="relative left-2 text-error-primary"
                    useCustomError={true}
                  >
                    {errors.username ? (
                      <span>{translation("sign-up:username.error")}</span>
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
                    {translation("sign-up:email.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-accent-500"
                      type="email"
                      placeholder={translation("sign-up:email.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className="relative left-2 text-error-primary"
                    useCustomError={true}
                  >
                    {errors.email ? (
                      <span>{translation("sign-up:email.error")}</span>
                    ) : null}
                  </FormMessage>
                </FormItem>
              )}
            />
            <Button
              className={`bg-accent-500 text-white font-semibold py-2.5 w-1/2`}
              type="submit"
            >
              {translation("common:cta.save")}
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
