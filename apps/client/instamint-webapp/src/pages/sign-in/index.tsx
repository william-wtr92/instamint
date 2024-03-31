import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useState } from "react"
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
import { useShowTemp } from "@/web/hooks/customs/useShowTemp"
import { useDelayedRedirect } from "@/web/hooks/customs/useDelayedRedirect"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["errors", "sign-in"])),
    },
  }
}

const SignInPage = () => {
  const {
    services: {
      auth: { signIn },
    },
  } = useAppContext()

  const { t } = useTranslation(["errors", "sign-in"])

  const [triggerRedirect, setTriggerRedirect] = useState<boolean>(false)
  const [redirectLink, setRedirectLink] = useState<string>("")
  const [redirectDelay, setRedirectDelay] = useState<number>(0)
  const [error, setError] = useShowTemp<Error | string | null>(null, 8000)
  const [success, setSuccess] = useShowTemp<string | null>(null, 3000)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  useDelayedRedirect(redirectLink, redirectDelay, triggerRedirect)

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
      setRedirectLink("/")
      setRedirectDelay(3000)
      setTriggerRedirect(true)
    },
    [setError, setSuccess, setTriggerRedirect, signIn, t]
  )

  const handleRedirect = useCallback(() => {
    setRedirectLink("/sign-up")
    setRedirectDelay(0)
    setTriggerRedirect(true)
  }, [setRedirectLink, setRedirectDelay, setTriggerRedirect])

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
                    {t("sign-in:email.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-accent-500"
                      type="email"
                      placeholder={t("sign-in:email.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className="relative left-2 text-error-primary"
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
                  <FormLabel className="relative left-1 font-bold flex gap-2 items-center">
                    <span>{t("sign-in:password.label")}</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="mt-2 py-2 px-4 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-accent-500"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("sign-in:password.placeholder")}
                        {...field}
                      />
                      {showPassword ? (
                        <EyeSlashIcon
                          className="absolute right-2 top-1/4 w-4 h-5 hover:cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      ) : (
                        <EyeIcon
                          className="absolute right-2 top-1/4 w-4 h-5 hover:cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage
                    className="relative left-2 text-error-primary"
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
              className={`bg-accent-500 text-white font-semibold py-2.5 w-1/2 ${!form.formState.isValid ? "cursor-not-allowed opacity-50" : "hover:cursor-pointer"}`}
              type="submit"
            >
              {t("sign-in:submit")}
            </Button>
            <div className="flex items-center gap-1.5 text-medium">
              <p className="font-semibold">
                {t("sign-in:redirect.description")}
              </p>
              <p
                className="font-bold text-accent-600 hover:cursor-pointer hover:scale-105"
                onClick={handleRedirect}
              >
                {t("sign-in:redirect.link")}
              </p>
            </div>
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

export default SignInPage
