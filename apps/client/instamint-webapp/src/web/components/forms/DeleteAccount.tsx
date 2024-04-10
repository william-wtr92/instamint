import { useForm } from "react-hook-form"
import { useTranslation } from "next-i18next"
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

type Props = {
  onSubmit: (values: DeleteAccount) => void
  success: string | null
  error: string | Error | null
}

export const DeleteAccountForm = (props: Props) => {
  const { onSubmit, success, error } = props

  const { t } = useTranslation()

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
            <Label className="font-semibold hover:cursor-pointer">
              {t("profile-settings:delete-account.triggerLabel")}
            </Label>
          </DialogTrigger>
          <DialogContent className="bg-white flex flex-col gap-5">
            <DialogHeader className="flex flex-col gap-3">
              <DialogTitle className="font-extrabold">
                {t("profile-settings:delete-account.title")}
              </DialogTitle>
              <DialogDescription className="flex flex-col gap-2">
                <span>
                  {t("profile-settings:delete-account.description.p1")}
                </span>
                <span>
                  {t("profile-settings:delete-account.description.p2")}
                </span>
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <FormLabel className="relative left-1 font-bold flex gap-2 items-center">
                        <span>
                          {t("profile-settings:delete-account.password.label")}
                        </span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="mt-4 py-2 px-4 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-accent-500"
                            type="password"
                            placeholder={t(
                              "profile-settings:delete-account.password.placeholder"
                            )}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage
                        className="relative left-2 text-error-primary"
                        useCustomError={true}
                      >
                        {errors.password ? (
                          <span>
                            {t(
                              "profile-settings:delete-account.password.error"
                            )}
                          </span>
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
                      <FormLabel className="relative left-1 font-bold flex gap-2 items-center mt-6">
                        <span>
                          {t(
                            "profile-settings:delete-account.confirmPassword.label"
                          )}
                        </span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="mt-4 py-2 px-4 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-accent-500"
                            type="password"
                            placeholder={t(
                              "profile-settings:delete-account.confirmPassword.placeholder"
                            )}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage
                        className="relative left-2 text-error-primary"
                        useCustomError={true}
                      >
                        {errors.confirmPassword ? (
                          <span>
                            {t(
                              "profile-settings:delete-account.confirmPassword.error"
                            )}
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
                    className="bg-accent-500 text-white font-semibold py-2.5 mt-6"
                  >
                    {t("profile-settings:delete-account.cta.submit")}
                  </Button>
                </DialogFooter>
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
            </div>
          </DialogContent>
        </Dialog>
      </Form>
    </>
  )
}
