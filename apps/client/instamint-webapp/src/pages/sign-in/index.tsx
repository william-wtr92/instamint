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
import useActionsContext from "@/web/contexts/useActionsContext"
import AuthLayout from "@/web/components/layout/AuthLayout"
import getTranslationBaseImports from "@/web/utils/helpers/getTranslationBaseImports"
import { routes } from "@/web/routes"
import TwoFactorLoginModal from "@/web/components/utils/TwoFactorLoginModal"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        ...getTranslationBaseImports(),
        "sign-in",
      ])),
    },
  }
}

const SignInPage = () => {
  const { t } = useTranslation("sign-in")

  const {
    services: {
      auth: { signIn, signIn2fa },
    },
  } = useAppContext()

  const { redirect, toast } = useActionsContext()

  const [show2faModal, setShow2faModal] = useState<boolean>(false)
  const [otpCode, setOtpCode] = useState<string>("")
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

  const handleCloseModal = useCallback(() => {
    setShow2faModal(false)
  }, [])

  const onSubmit = useCallback(
    async (values: SignIn) => {
      const [err] = await signIn(values)

      if (err?.message === "errorTwoFactorAuthRequired") {
        setShow2faModal(true)

        return
      }

      if (err) {
        toast({
          variant: "error",
          description: t(`errors:auth.${err.message}`),
        })

        return
      }

      toast({
        variant: "success",
        description: t("success"),
      })
      redirect(routes.client.home, 3000)
    },
    [redirect, signIn, t, toast]
  )

  const signInWith2fa = useCallback(
    async (authorizeDevice: boolean) => {
      const data = {
        email: form.watch("email"),
        password: form.watch("password"),
        code: otpCode,
        authorizeDevice,
      }

      const [err] = await signIn2fa(data)

      if (err) {
        toast({
          description: t(
            `errors:users.profile-settings.security.2fa.${err.message}`
          ),
          variant: "error",
        })

        return
      }

      toast({
        variant: "success",
        description: t("success"),
      })

      handleCloseModal()
      redirect(routes.client.home, 3000)
    },
    [otpCode, signIn2fa, toast, t, redirect, form, handleCloseModal]
  )

  const handleRedirect = useCallback(
    (path: string) => {
      redirect(path, 0)
    },
    [redirect]
  )

  return (
    <>
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
                      {t("email.label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="focus-visible:outline-accent-500 mt-2 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                        type="email"
                        placeholder={t("email.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage
                      className="text-error-primary relative left-2"
                      useCustomError={true}
                    >
                      {errors.email ? <span>{t("email.error")}</span> : null}
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
                      <span>{t("password.label")}</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="focus-visible:outline-accent-500 mt-2 px-4 py-2 focus-visible:border-0 focus-visible:ring-0"
                          type={showPassword ? "text" : "password"}
                          placeholder={t("password.placeholder")}
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
                        <span>{t("password.error")}</span>
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
                {t("cta.submit")}
              </Button>
              <div className="text-medium flex w-full items-center justify-center gap-32">
                <div className="flex flex-col text-center">
                  <p className="font-semibold">{t("cta.reset.description")}</p>
                  <p
                    className="text-accent-600 font-bold hover:scale-105 hover:cursor-pointer"
                    onClick={() =>
                      handleRedirect(routes.client.users.resetPasswordRequest)
                    }
                  >
                    {t("cta.reset.link")}
                  </p>
                </div>
                <div className="flex flex-col text-center">
                  <p className="font-semibold">
                    {t("cta.sign-in.description")}
                  </p>
                  <p
                    className="text-accent-600 font-bold hover:scale-105 hover:cursor-pointer"
                    onClick={() => handleRedirect(routes.client.signUp)}
                  >
                    {t("cta.sign-in.link")}
                  </p>
                </div>
              </div>
            </form>
          </Form>
        </div>
        {show2faModal && (
          <TwoFactorLoginModal
            isOpen={show2faModal}
            handleCloseModal={handleCloseModal}
            otpCode={otpCode}
            setOtpCode={setOtpCode}
            signInWith2fa={signInWith2fa}
          />
        )}
      </div>
    </>
  )
}
SignInPage.title = "auth.login"

SignInPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>
}

export default SignInPage
