import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useState } from "react"
import { useRouter } from "next/router"
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["email"])),
    },
  }
}

const UsersResendEmailValidationPage = () => {
  const router = useRouter()
  const {
    services: {
      users: { resendEmailValidation },
    },
  } = useAppContext()

  const { t } = useTranslation("email")

  const [error, setError] = useState<Error | string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

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
        setError(err)

        return
      }

      setSuccess(t("resend.successfully"))

      const timeout = setTimeout(async () => {
        await router.push("/")
      }, 3000)

      return () => clearTimeout(timeout)
    },
    [resendEmailValidation, router, t]
  )

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="w-[95%] sm:w-[70%] xl:w-[40%]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex items-center flex-col p-6 space-y-8 bg-white rounded-md shadow-xl"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="relative left-1 font-bold">
                    {t("resend.email.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:outline-neutral-tertiary"
                      placeholder={t("resend.email.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="relative left-2  mt-2 text-xs">
                    {t("resend.email.description")}
                  </FormDescription>
                  <FormMessage
                    className="relative left-2 text-error-primary"
                    useCustomError={true}
                  >
                    {form.formState.errors.email ? (
                      <div>{t("resend.email.error")}</div>
                    ) : null}
                  </FormMessage>
                </FormItem>
              )}
            />
            <Button
              disabled={!form.formState.isValid}
              className={`border-2 border-black px-5 py-2 w-[60%] ${!form.formState.isValid ? "cursor-not-allowed" : ""}`}
              type="submit"
            >
              {t("resend.email.submit")}
            </Button>
            {success ? (
              <p className="text-sm text-center text-black">{success}</p>
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

export default UsersResendEmailValidationPage
