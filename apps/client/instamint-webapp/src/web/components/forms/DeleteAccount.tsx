import { zodResolver } from "@hookform/resolvers/zod"
import {
  type DeleteAccount,
  deleteAccountSchema,
} from "@instamint/shared-types"
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
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
  onSubmit: (values: DeleteAccount) => void
}

export const DeleteAccountForm = (props: Props) => {
  const { onSubmit } = props

  const { t } = useTranslation("profile-settings-security")

  const form = useForm<DeleteAccount>({
    resolver: zodResolver(deleteAccountSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
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
            <Label className="hover:cursor-pointer">
              {t("delete-account.triggerLabel")}
            </Label>
          </DialogTrigger>
          <DialogContent className="flex flex-col gap-5 bg-white">
            <DialogHeader className="flex flex-col gap-3">
              <DialogTitle className="font-extrabold">
                {t("delete-account.title")}
              </DialogTitle>
              <DialogDescription className="flex flex-col gap-2">
                <span>{t("delete-account.description.p1")}</span>
                <span>{t("delete-account.description.p2")}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="gap grid">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <FormLabel className="relative left-1 flex items-center gap-2 font-bold">
                        <span>{t("delete-account.password.label")}</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="focus-visible:outline-accent-500 mt-4 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                            type="password"
                            placeholder={t(
                              "delete-account.password.placeholder"
                            )}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage
                        className="text-error-primary relative left-2"
                        useCustomError={true}
                      >
                        {errors.password ? (
                          <span>{t("delete-account.password.error")}</span>
                        ) : null}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <FormLabel className="relative left-1 mt-6 flex items-center gap-2 font-bold">
                        <span>{t("delete-account.confirmPassword.label")}</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="focus-visible:outline-accent-500 mt-4 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                            type="password"
                            placeholder={t(
                              "delete-account.confirmPassword.placeholder"
                            )}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage
                        className="text-error-primary relative left-2"
                        useCustomError={true}
                      >
                        {errors.confirmPassword ? (
                          <span>
                            {t("delete-account.confirmPassword.error")}
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
                    {t("delete-account.cta.submit")}
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
