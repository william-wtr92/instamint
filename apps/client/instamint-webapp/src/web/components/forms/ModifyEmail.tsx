import { zodResolver } from "@hookform/resolvers/zod"
import { type ModifyEmail, modifyEmailSchema } from "@instamint/shared-types"
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
} from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"
import { useForm } from "react-hook-form"

type Props = {
  onSubmit: (values: ModifyEmail) => void
}

export const ModifyEmailForm = (props: Props) => {
  const { onSubmit } = props

  const { t } = useTranslation("profile-settings-security")

  const form = useForm<ModifyEmail>({
    resolver: zodResolver(modifyEmailSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      newEmail: "",
    },
  })

  const {
    formState: { errors },
  } = form

  return (
    <>
      <Form {...form}>
        <Dialog onOpenChange={() => form.reset()}>
          <DialogTrigger asChild>
            <Label className="font-semibold hover:cursor-pointer">
              {t(`profile-settings:modify-email.triggerLabel`)}
            </Label>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader className="mb-6">
              <DialogTitle className="font-extrabold">
                {t(`profile-settings:modify-email.title`)}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <FormLabel className="relative left-1 flex items-center gap-2 font-bold">
                        <span>
                          {t(`profile-settings:modify-email.mail.label`)}
                        </span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="focus-visible:outline-accent-500 mt-4 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                            type="email"
                            placeholder={t(
                              `profile-settings:modify-email.mail.placeholder`
                            )}
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <FormLabel className="relative left-1 mt-6 flex items-center gap-2 font-bold">
                        <span>
                          {t(`profile-settings:modify-email.password.label`)}
                        </span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="focus-visible:outline-accent-500 mt-4 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                            type="password"
                            placeholder={t(
                              `profile-settings:modify-email.password.placeholder`
                            )}
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newEmail"
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <FormLabel className="relative left-1 mt-6 flex items-center gap-2 font-bold">
                        <span>
                          {t(`profile-settings:modify-email.newMail.label`)}
                        </span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="focus-visible:outline-accent-500 mt-4 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                            type="email"
                            placeholder={t(
                              `profile-settings:modify-email.newMail.placeholder`
                            )}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage
                        className="text-error-primary relative left-2"
                        useCustomError={true}
                      >
                        {errors.newEmail ? (
                          <span>
                            {t(`profile-settings:modify-email.newMail.error`)}
                          </span>
                        ) : null}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    disabled={!form.formState.isValid}
                    type="submit"
                    className="bg-accent-500 mt-6 py-2.5 font-semibold text-white"
                  >
                    {t(`profile-settings:modify-email.submit`)}
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </Form>
    </>
  )
}
