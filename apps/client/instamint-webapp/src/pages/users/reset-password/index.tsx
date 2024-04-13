import { zodResolver } from "@hookform/resolvers/zod"
import type { ReactElement } from "react"
import { useCallback } from "react"
import { useTranslation } from "next-i18next"
import type { GetServerSideProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useForm } from "react-hook-form"
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@instamint/ui-kit"
import {
  requestResetPasswordSchema,
  type RequestResetPassword,
} from "@instamint/shared-types"

import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useDelayedRedirect } from "@/web/hooks/customs/useDelayedRedirect"
import AuthLayout from "@/web/components/layout/AuthLayout"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "errors",
        "reset-password",
      ])),
    },
  }
}

const RequestResetPasswordPage = () => {
  const { t } = useTranslation(["errors", "reset-password"])

  const {
    services: {
      users: { requestResetPassword },
    },
  } = useAppContext()

  const { redirect, error, setError, success, setSuccess } = useActionsContext()

  useDelayedRedirect()

  const form = useForm<RequestResetPassword>({
    resolver: zodResolver(requestResetPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = useCallback(
    async (values: RequestResetPassword) => {
      const [err] = await requestResetPassword(values)

      if (err) {
        setError(t(`errors:users.reset.${err.message}`))

        return
      }

      setSuccess(t("reset-password:request.success"))
      redirect("/", 3000)
    },
    [redirect, setError, setSuccess, requestResetPassword, t]
  )

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="w-[95%] sm:w-[70%] xl:w-[40%]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-text-large-screen flex w-full flex-col items-center space-y-8 rounded-md bg-white shadow-xl"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="relative left-1 font-bold">
                    {t("reset-password:request.email.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:outline-accent-500 mt-2 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                      placeholder={t(
                        "reset-password:request.email.placeholder"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="relative left-2 mt-2 text-xs">
                    {t("reset-password:request.email.description")}
                  </FormDescription>
                  <FormMessage
                    className="text-error-primary relative left-2"
                    useCustomError={true}
                  >
                    {form.formState.errors.email ? (
                      <span>{t("reset-password:request.email.error")}</span>
                    ) : null}
                  </FormMessage>
                </FormItem>
              )}
            />
            <Button
              disabled={!form.formState.isValid}
              className={`bg-accent-500 w-1/2 py-2.5 font-semibold text-white ${!form.formState.isValid ? "cursor-not-allowed opacity-50" : "hover:cursor-pointer"}`}
              type="submit"
            >
              {t("reset-password:request.email.cta.submit")}
            </Button>
            {success ? (
              <p className="text-accent-600 text-center text-sm">{success}</p>
            ) : null}
            {error ? (
              <p className="text-md text-error-primary text-center">
                {error instanceof Error ? error.message : error}
              </p>
            ) : null}
          </form>
        </Form>
      </div>
    </div>
  )
}
RequestResetPasswordPage.title = "users.reset-password"

RequestResetPasswordPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>
}

export default RequestResetPasswordPage
