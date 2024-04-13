import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type ReactElement, useCallback, useState } from "react"
import type { GetServerSideProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
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
import { type SignIn, signInSchema } from "@instamint/shared-types"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"

import useAppContext from "@/web/contexts/useAppContext"
import { useDelayedRedirect } from "@/web/hooks/customs/useDelayedRedirect"
import useActionsContext from "@/web/contexts/useActionsContext"
import AuthLayout from "@/web/components/layout/AuthLayout"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["errors", "sign-in"])),
    },
  }
}

const SignInPage = () => {
  const { t } = useTranslation(["errors", "sign-in"])

  const {
    services: {
      auth: { signIn },
    },
  } = useAppContext()

  const { redirect, error, setError, success, setSuccess } = useActionsContext()

  useDelayedRedirect()

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const form = useForm<SignIn>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const {
    formState: { errors },
  } = form

  const onSubmit = useCallback(
    async (values: SignIn) => {
      const [err] = await signIn(values)

      if (err) {
        setError(t(`errors:auth.${err.message}`))

        return
      }

      setSuccess(t("sign-in:success"))
      redirect("/", 3000)
    },
    [redirect, setError, setSuccess, signIn, t]
  )

  const handleRedirect = useCallback(
    (path: string) => {
      redirect(path, 0)
    },
    [redirect]
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
                    {t("sign-in:email.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:outline-accent-500 mt-2 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                      type="email"
                      placeholder={t("sign-in:email.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className="text-error-primary relative left-2"
                    useCustomError={true}
                  >
                    {errors.email ? (
                      <span>{t("sign-in:email.error")}</span>
                    ) : null}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel className="relative left-1 flex items-center gap-2 font-bold">
                    <span>{t("sign-in:password.label")}</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="focus-visible:outline-accent-500 mt-2 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("sign-in:password.placeholder")}
                        {...field}
                      />
                      {showPassword ? (
                        <EyeSlashIcon
                          className="absolute right-2 top-1/4 h-5 w-4 hover:cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      ) : (
                        <EyeIcon
                          className="absolute right-2 top-1/4 h-5 w-4 hover:cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage
                    className="text-error-primary relative left-2"
                    useCustomError={true}
                  >
                    {errors.password ? (
                      <span>{t("sign-in:password.error")}</span>
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
              {t("sign-in:cta.submit")}
            </Button>
            <div className="text-medium flex w-full items-center justify-center gap-32">
              <div className="flex flex-col text-center">
                <p className="font-semibold">
                  {t("sign-in:cta.reset.description")}
                </p>
                <p
                  className="text-accent-600 font-bold hover:scale-105 hover:cursor-pointer"
                  onClick={() => handleRedirect("/users/reset-password")}
                >
                  {t("sign-in:cta.reset.link")}
                </p>
              </div>
              <div className="flex flex-col text-center">
                <p className="font-semibold">
                  {t("sign-in:cta.sign-in.description")}
                </p>
                <p
                  className="text-accent-600 font-bold hover:scale-105 hover:cursor-pointer"
                  onClick={() => handleRedirect("/sign-up")}
                >
                  {t("sign-in:cta.sign-in.link")}
                </p>
              </div>
            </div>
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
SignInPage.title = "Sign In"

SignInPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>
}

export default SignInPage
