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
import useAppContext from "@/web/contexts/useAppContext"
import { checkPasswordHelper } from "@/web/utils/helpers/checkPasswordHelper"
import { useShowTemp } from "@/web/hooks/customs/useShowTemp"
import { useDelayedRedirect } from "@/web/hooks/customs/useDelayedRedirect"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["errors", "signup"])),
    },
  }
}

const SignUpPage = () => {
  const {
    services: {
      users: { signUp },
    },
  } = useAppContext()

  const { t } = useTranslation(["errors", "signup"])

  const [triggerRedirect, setTriggerRedirect] = useState<boolean>(false)
  const [redirectDelay, setRedirectDelay] = useState<number>(0)
  const [error, setError] = useShowTemp<Error | string | null>(null, 10000)
  const [success, setSuccess] = useShowTemp<string | null>(null, 5000)
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

  useDelayedRedirect("/", redirectDelay, triggerRedirect)

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
        setError(t(`errors:users.${err.message}`))
        setRedirectDelay(10000)

        return
      }

      setSuccess(t("signup:success"))
      setRedirectDelay(5000)
      setTriggerRedirect(true)
    },
    [setError, setSuccess, setTriggerRedirect, signUp, t]
  )

  const disabled =
    !form.formState.isValid || !form.watch("gdprValidation") || !checkPassword

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
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="relative left-1 font-bold">
                    {t("signup:username.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:outline-neutral-300"
                      placeholder={t("signup:username.placeholder")}
                      onFocus={() => {
                        setIsFocused(false)
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="relative left-2  mt-2 text-medium">
                    {t("signup:username.description")}
                  </FormDescription>
                  <FormMessage
                    className="relative left-2 text-error-primary"
                    useCustomError={true}
                  >
                    {errors.username ? (
                      <span>{t("signup:username.error")}</span>
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
                    {t("signup:email.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:outline-neutral-300"
                      type="email"
                      placeholder={t("signup:email.placeholder")}
                      onFocus={() => {
                        setIsFocused(false)
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className="relative left-2 text-error-primary"
                    useCustomError={true}
                  >
                    {errors.email ? (
                      <span>{t("signup:email.error")}</span>
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
                    <span>{t("signup:password.label")}</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="mt-2 py-2 px-4 focus-visible:outline-neutral-300"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("signup:password.placeholder")}
                        {...field}
                        onFocus={() => {
                          setIsFocused(true)
                        }}
                        onBlur={() => setIsFocused(false)}
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
                  {isFocused ? (
                    <div
                      className="relative -left-4 rounded-md mt-4 bg-white bg-opacity-40 xl:border-1 xl:shadow-2xl p-4 xl:-bottom-10 xl:-left-56 xl:absolute"
                      tabIndex={-1}
                    >
                      <div className="w-full px-4 rounded-md">
                        {Object.entries(passwordCriteria).map(
                          ([key, value]) => (
                            <span
                              key={key}
                              className={`flex items-center gap-3 text-medium`}
                            >
                              <span
                                className={`w-3 h-3 border border-input  rounded-2xl ${value ? "bg-accent-600" : "bg-neutral-50"}`}
                              ></span>
                              <span
                                className={`${value ? "font-light" : "font-bold"} `}
                              >
                                {t(`signup:password.criteria.${key}`)}
                              </span>
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  ) : null}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="relative left-1 font-bold">
                    {t("signup:confirmPassword.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:outline-neutral-300"
                      type="password"
                      placeholder={t("signup:confirmPassword.placeholder")}
                      onFocus={() => {
                        setIsFocused(false)
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className="relative left-2 text-error-primary"
                    useCustomError={true}
                  >
                    {errors.confirmPassword ? (
                      <span>{t("signup:confirmPassword.error")}</span>
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
                      className="flex justify-center justify-items-center items-center border-2 border-black w-7 h-7 rounded-md data-[state=checked]:bg-accent-400 data-[state=checked]:text-white data-[state=checked]:border-0"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      onFocus={() => {
                        setIsFocused(false)
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("signup:terms.label")}</FormLabel>
                    <FormDescription className="relative left-[0.1rem]  mt-2 text-medium">
                      {t("signup:terms.description")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button
              disabled={disabled}
              className={`border-2 border-black px-5 py-2 w-[60%] ${disabled ? "cursor-not-allowed" : ""}`}
              type="submit"
            >
              {t("signup:submit")}
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

export default SignUpPage
