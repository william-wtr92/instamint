import { zodResolver } from "@hookform/resolvers/zod"
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
  const {
    services: {
      users: { requestResetPassword },
    },
  } = useAppContext()

  const {
    setTriggerRedirect,
    setRedirectLink,
    setRedirectDelay,
    error,
    setError,
    success,
    setSuccess,
  } = useActionsContext()

  const { t } = useTranslation(["errors", "reset-password"])

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
      setRedirectDelay(3000)
      setRedirectLink("/")
      setTriggerRedirect(true)
    },
    [
      setError,
      setSuccess,
      setRedirectLink,
      setRedirectDelay,
      setTriggerRedirect,
      requestResetPassword,
      t,
    ]
  )

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="w-[95%] sm:w-[70%] xl:w-[40%]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex items-center flex-col p-text-large-screen space-y-8 bg-white rounded-md shadow-xl"
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
                      className="mt-2 py-2 px-4 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-accent-500"
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
                    className="relative left-2 text-error-primary"
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
              className={`bg-accent-500 text-white font-semibold py-2.5 w-1/2 ${!form.formState.isValid ? "cursor-not-allowed opacity-50" : "hover:cursor-pointer"}`}
              type="submit"
            >
              {t("reset-password:request.email.cta.submit")}
            </Button>
            {success ? (
              <p className="text-sm text-center text-accent-600">{success}</p>
            ) : null}
            {error ? (
              <p className="text-md text-center text-error-primary">
                {error instanceof Error ? error.message : error}
              </p>
            ) : null}
          </form>
        </Form>
      </div>
    </div>
  )
}

export default RequestResetPasswordPage
