import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback } from "react"
import type { GetServerSideProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
  Input,
  Button,
} from "@instamint/ui-kit"
import {
  type UserResendEmail,
  userResendEmailValidationSchema,
} from "@instamint/shared-types"

import useAppContext from "@/web/contexts/useAppContext"
import { useDelayedRedirect } from "@/web/hooks/customs/useDelayedRedirect"
import useActionsContext from "@/web/contexts/useActionsContext"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["errors", "email"])),
    },
  }
}

const ResendEmailValidationPage = () => {
  const {
    services: {
      auth: { resendEmailValidation },
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

  const { t } = useTranslation(["errors", "email"])

  useDelayedRedirect()

  const form = useForm<UserResendEmail>({
    resolver: zodResolver(userResendEmailValidationSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = useCallback(
    async (values: UserResendEmail) => {
      const [err] = await resendEmailValidation(values)

      if (err) {
        setError(t(`errors:auth.${err.message}`))

        return
      }

      setSuccess(t("email:resend.successfully"))
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
      resendEmailValidation,
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
                    {t("email:resend.email.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-accent-500"
                      placeholder={t("email:resend.email.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="relative left-2 mt-2 text-xs">
                    {t("email:resend.email.description")}
                  </FormDescription>
                  <FormMessage
                    className="relative left-2 text-error-primary"
                    useCustomError={true}
                  >
                    {form.formState.errors.email ? (
                      <span>{t("email:resend.email.error")}</span>
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
              {t("email:resend.email.cta.submit")}
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

export default ResendEmailValidationPage
