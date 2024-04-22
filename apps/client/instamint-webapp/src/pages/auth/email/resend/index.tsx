import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type ReactElement, useCallback } from "react"
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
import useActionsContext from "@/web/contexts/useActionsContext"
import AuthLayout from "@/web/components/layout/AuthLayout"
import getTranslationBaseImports from "@/web/utils/helpers/getTranslationBaseImports"
import { routes } from "@/web/routes"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        ...getTranslationBaseImports(),
        "email",
      ])),
    },
  }
}

const ResendEmailValidationPage = () => {
  const { t } = useTranslation(["errors", "email"])

  const {
    services: {
      auth: { resendEmailValidation },
    },
  } = useAppContext()

  const { redirect, toast } = useActionsContext()

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
        toast({
          variant: "error",
          description: t(`errors:auth.${err.message}`),
        })

        return
      }

      toast({
        variant: "success",
        description: t("email:resend.successfully"),
      })
      redirect(routes.client.home, 3000)
    },
    [redirect, resendEmailValidation, t, toast]
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
                    {t("email:resend.email.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:outline-accent-500 mt-2 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                      placeholder={t("email:resend.email.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="relative left-2 mt-2 text-xs">
                    {t("email:resend.email.description")}
                  </FormDescription>
                  <FormMessage
                    className="text-error-primary relative left-2"
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
              className={`bg-accent-500 w-1/2 py-2.5 font-semibold text-white ${!form.formState.isValid ? "cursor-not-allowed opacity-50" : "hover:cursor-pointer"}`}
              type="submit"
            >
              {t("email:resend.email.cta.submit")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
ResendEmailValidationPage.title = "auth.email.confirmation"

ResendEmailValidationPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>
}

export default ResendEmailValidationPage
