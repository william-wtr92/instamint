import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect, useState } from "react"
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
  Checkbox,
} from "@instamint/ui-kit"
import { signUpSchema, type SignUp } from "@instamint/shared-types"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"

import useAppContext from "@/web/contexts/useAppContext"
import { checkPasswordHelper } from "@/web/utils/helpers/checkPasswordHelper"
import { useDelayedRedirect } from "@/web/hooks/customs/useDelayedRedirect"
import useActionsContext from "@/web/contexts/useActionsContext"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["errors", "sign-up"])),
    },
  }
}

const SignUpPage = () => {
  const {
    services: {
      auth: { signUp },
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

  const { t } = useTranslation(["errors", "sign-up"])

  useDelayedRedirect()

  const [passwordCriteria, setPasswordCriteria] = useState<
    Record<string, boolean>
  >({
    uppercase: false,
    lowercase: false,
    number: false,
    specialCharacter: false,
    length: false,
  })
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isFocused, setIsFocused] = useState<boolean>(false)

  const form = useForm<SignUp>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      gdprValidation: false,
    },
  })

  const {
    watch,
    formState: { errors },
  } = form

  const password = watch("password")
  const checkPassword = Object.values(passwordCriteria).every(Boolean)

  useEffect(() => {
    setPasswordCriteria(checkPasswordHelper(password))
  }, [password])

  const onSubmit = useCallback(
    async (values: SignUp) => {
      const [err] = await signUp(values)

      if (err) {
        setError(t(`errors:auth.${err.message}`))

        return
      }

      setSuccess(t("sign-up:success"))
      setRedirectLink("/sign-in")
      setRedirectDelay(3000)
      setTriggerRedirect(true)
    },
    [
      setError,
      setSuccess,
      setRedirectLink,
      setRedirectDelay,
      setTriggerRedirect,
      signUp,
      t,
    ]
  )

  const handleRedirect = useCallback(() => {
    setRedirectLink("/sign-in")
    setRedirectDelay(0)
    setTriggerRedirect(true)
  }, [setRedirectLink, setRedirectDelay, setTriggerRedirect])

  const disabled =
    form.formState.isValid && form.watch("gdprValidation") && checkPassword

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
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="relative left-1 font-bold">
                    {t("sign-up:username.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-accent-500"
                      placeholder={t("sign-up:username.placeholder")}
                      onFocus={() => setIsFocused(false)}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="relative left-2 mt-2 text-medium">
                    {t("sign-up:username.description")}
                  </FormDescription>
                  <FormMessage
                    className="relative left-2 text-error-primary"
                    useCustomError={true}
                  >
                    {errors.username ? (
                      <span>{t("sign-up:username.error")}</span>
                    ) : null}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="relative left-1 font-bold">
                    {t("sign-up:email.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-accent-500"
                      type="email"
                      placeholder={t("sign-up:email.placeholder")}
                      onFocus={() => setIsFocused(false)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className="relative left-2 text-error-primary"
                    useCustomError={true}
                  >
                    {errors.email ? (
                      <span>{t("sign-up:email.error")}</span>
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
                    <span>{t("sign-up:password.label")}</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="mt-2 py-2 px-4 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-accent-500"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("sign-up:password.placeholder")}
                        {...field}
                        onFocus={() => {
                          setIsFocused(true)
                        }}
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
                  <div
                    className={`relative rounded-md bg-white mt-6 xl:mt-0 xl:p-4 xl:z-[-1] xl:transition-transform xl:duration-700 xl:ease-in-out xl:transform xl:bg-opacity-40 xl:shadow-2xl xl:absolute xl:-bottom-10 xl:-left-56 ${isFocused ? "xl:translate-x-0" : "xl:translate-x-[115%]"}`}
                    tabIndex={-1}
                  >
                    <div className={`w-full px-4 rounded-md`}>
                      {Object.entries(passwordCriteria).map(([key, value]) => (
                        <span
                          key={key}
                          className={`flex items-center gap-3 text-medium ${value ? "opacity-100" : "opacity-60"}`}
                        >
                          <span
                            className={`transition-colors duration-500 size-3 border border-input  rounded-2xl ${value ? "bg-accent-600" : "bg-neutral-200"}`}
                          ></span>
                          <span
                            className={`${value ? "text-medium font-semibold" : "text-medium font-light"} `}
                          >
                            {t(`sign-up:password.criteria.${key}`)}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="relative left-1 font-bold">
                    {t("sign-up:confirmPassword.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-accent-500"
                      type="password"
                      placeholder={t("sign-up:confirmPassword.placeholder")}
                      onFocus={() => setIsFocused(false)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className="relative left-2 text-error-primary"
                    useCustomError={true}
                  >
                    {errors.confirmPassword ? (
                      <span>{t("sign-up:confirmPassword.error")}</span>
                    ) : null}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gdprValidation"
              render={({ field }) => (
                <FormItem className="w-full flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      id="terms2"
                      className="transition duration-700 flex justify-center justify-items-center items-center border-1 size-7 rounded-md data-[state=checked]:bg-accent-500 data-[state=checked]:text-white focus-visible:outline-accent-500"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      onFocus={() => setIsFocused(false)}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("sign-up:terms.label")}</FormLabel>
                    <FormDescription className="relative left-[0.1rem] mt-2 text-medium">
                      {t("sign-up:terms.description")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button
              disabled={!disabled}
              className={`bg-accent-500 text-white font-semibold py-2.5 w-1/2 ${!disabled ? "cursor-not-allowed opacity-50" : "hover:cursor-pointer"}`}
              type="submit"
            >
              {t("sign-up:cta.submit")}
            </Button>
            <div className="flex items-center gap-1.5 text-medium">
              <p className="font-semibold">
                {t("sign-up:cta.redirect.description")}
              </p>
              <p
                className="font-bold text-accent-600 hover:cursor-pointer hover:scale-105"
                onClick={handleRedirect}
              >
                {t("sign-up:cta.redirect.link")}
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

export default SignUpPage
